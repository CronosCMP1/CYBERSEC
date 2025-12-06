import { supabase } from './supabaseClient';
import { Article, ArticleCategory } from '../types';

// Map internal CamelCase model to Database snake_case model
const mapFromDb = (dbArticle: any): Article => ({
  id: dbArticle.id,
  title: dbArticle.title,
  excerpt: dbArticle.excerpt || '',
  content: dbArticle.content || '',
  author: dbArticle.author || 'Anônimo',
  date: dbArticle.date || new Date().toISOString(),
  imageUrl: dbArticle.image_url || 'https://placehold.co/600x400',
  category: (dbArticle.category as ArticleCategory) || ArticleCategory.CYBERSECURITY,
  readTime: dbArticle.read_time || '5 min',
  featured: dbArticle.featured || false
});

const mapToDb = (article: Article) => ({
  id: article.id,
  title: article.title,
  excerpt: article.excerpt,
  content: article.content,
  author: article.author,
  date: article.date,
  image_url: article.imageUrl,
  category: article.category,
  read_time: article.readTime,
  featured: article.featured
});

export const getArticles = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      // Log the full error object as a string so it is readable in consoles
      console.error('Supabase Error fetching articles:', JSON.stringify(error, null, 2));
      throw new Error(error.message || 'Erro desconhecido ao buscar artigos');
    }

    return (data || []).map(mapFromDb);
  } catch (err: any) {
    console.error('Unexpected error in getArticles:', err);
    throw err;
  }
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching article ${id}:`, JSON.stringify(error, null, 2));
      return undefined;
    }

    return mapFromDb(data);
  } catch (err) {
    console.error(`Unexpected error fetching article ${id}:`, err);
    return undefined;
  }
};

export const saveArticle = async (article: Article): Promise<void> => {
  const dbArticle = mapToDb(article);
  const { error } = await supabase
    .from('articles')
    .upsert(dbArticle);

  if (error) {
    console.error('Error saving article:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }
};

export const uploadImageToStorage = async (file: File): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    
    const { data, error } = await supabase.storage
      .from('images') // Assumes a bucket named 'images' exists
      .upload(`public/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', JSON.stringify(error, null, 2));
      throw new Error(error.message);
    }

    // Construct public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (err: any) {
    console.error('Unexpected storage error:', err);
    throw err;
  }
};
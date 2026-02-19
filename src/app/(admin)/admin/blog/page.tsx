import { createClient } from '@/lib/supabase/server'
import BlogManager from './BlogManager'

export default async function AdminBlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return <BlogManager initialPosts={posts || []} />
}

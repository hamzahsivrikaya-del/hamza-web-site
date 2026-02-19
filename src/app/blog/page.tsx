import { createClient } from '@/lib/supabase/server'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div></div>
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Giriş
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-sm text-text-secondary mt-2">
                    {post.content?.slice(0, 150) ?? ''}...
                  </p>
                  <p className="text-xs text-text-secondary mt-3">
                    {post.published_at ? formatDate(post.published_at) : ''}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-text-secondary text-center py-8">Henüz yazı yok</p>
          </Card>
        )}
      </main>
    </div>
  )
}

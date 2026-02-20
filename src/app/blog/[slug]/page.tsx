import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  // Basit markdown -> HTML dönüşümü
  const htmlContent = post.content
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br/>')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-wider text-primary hover:opacity-80 transition-opacity">
            HAMZA SİVRİKAYA
          </Link>
          <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Tüm Yazılar
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-text-secondary mb-8">
          {post.published_at ? formatDate(post.published_at) : ''}
        </p>

        <div
          className="prose prose-invert max-w-none text-text-primary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${htmlContent}</p>` }}
        />
      </main>
    </div>
  )
}

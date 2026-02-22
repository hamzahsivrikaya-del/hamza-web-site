import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LandingNavbar from '@/components/shared/LandingNavbar'
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

  // Tiptap HTML çıktısını render et (eski markdown içerikler de desteklenir)
  const isHtml = post.content.trim().startsWith('<')
  const htmlContent = isHtml
    ? post.content
    : post.content
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>')

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LandingNavbar />

      <div className="pt-16">
        {/* Header */}
        <header className="border-b border-border bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
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
            className="blog-content max-w-none text-text-primary leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_mark]:rounded [&_mark]:px-1"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </main>
      </div>
    </div>
  )
}

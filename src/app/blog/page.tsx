import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import LandingNavbar from '@/components/shared/LandingNavbar'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Hamza Sivrikaya',
  description: 'Fitness, antrenman teknikleri ve sağlıklı yaşam hakkında yazılar.',
  openGraph: {
    title: 'Blog | Hamza Sivrikaya',
    description: 'Fitness, antrenman teknikleri ve sağlıklı yaşam hakkında yazılar.',
  },
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LandingNavbar />

      <div className="pt-16">
        {/* Page Header */}
        <div className="border-b border-border bg-white">
          <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 text-center">
            <h1 className="font-display text-3xl sm:text-4xl tracking-wider mb-2">BLOG</h1>
            <p className="text-sm sm:text-base text-text-secondary">Fitness ve sağlıklı yaşam hakkında yazılar</p>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 py-8">
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                    {post.cover_image && (
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, 768px"
                        />
                      </div>
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
    </div>
  )
}

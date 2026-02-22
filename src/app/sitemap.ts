import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')

  const blogUrls = (posts ?? []).map((post) => ({
    url: `https://hamzasivrikaya.com/blog/${post.slug}`,
    lastModified: post.updated_at,
  }))

  return [
    { url: 'https://hamzasivrikaya.com', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: 'https://hamzasivrikaya.com/blog', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: 'https://hamzasivrikaya.com/antrenmanlar', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: 'https://hamzasivrikaya.com/araclar', changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://hamzasivrikaya.com/araclar/kalori-hesaplayici', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://hamzasivrikaya.com/araclar/1rm-hesaplayici', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://hamzasivrikaya.com/araclar/bki-hesaplayici', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://hamzasivrikaya.com/araclar/su-ihtiyaci-hesaplayici', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://hamzasivrikaya.com/araclar/ideal-kilo-hesaplayici', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://hamzasivrikaya.com/araclar/deri-kaliper-hesaplayici', changeFrequency: 'monthly' as const, priority: 0.5 },
    ...blogUrls,
  ]
}

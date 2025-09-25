import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shop.rootwave.org'
  
  return [
    {
      url: baseUrl + '/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.00,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.80,
    },
    {
      url: `${baseUrl}/blogs/rice-straw-vs-paper-straw-comparison`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.64,
    },
    {
      url: `${baseUrl}/blogs/what-is-drinking-rice-straw-eco-friendly`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.64,
    },
    {
      url: `${baseUrl}/blogs/WhereToByRiceStrawsPostContent`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.64,
    },
    {
      url: `${baseUrl}/blogs/order-eco-friendly-straws-online`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.64,
    },
    {
      url: `${baseUrl}/blogs/Learning-from-Local-Heroes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.64,
    },
    {
      url: `${baseUrl}/blogs/why-rice-straws`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.64,
    },
    {
      url: `${baseUrl}/blogs/our-journey`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.64,
    },
  ]
}

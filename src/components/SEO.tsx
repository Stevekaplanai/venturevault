import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  keywords?: string
  noIndex?: boolean
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://venturevault.space/og-image-1200x630.png',
  keywords,
  noIndex = false
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Update canonical link
    const updateCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', url)
    }

    // Basic meta tags
    updateMeta('description', description)
    if (keywords) {
      updateMeta('keywords', keywords)
    }
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph tags
    updateMeta('og:title', title, true)
    updateMeta('og:description', description, true)
    updateMeta('og:image', ogImage, true)
    updateMeta('og:type', 'website', true)
    if (canonicalUrl) {
      updateMeta('og:url', canonicalUrl, true)
      updateCanonical(canonicalUrl)
    }

    // Twitter tags
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', title)
    updateMeta('twitter:description', description)
    updateMeta('twitter:image', ogImage)

  }, [title, description, canonicalUrl, ogImage, keywords, noIndex])

  return null
}

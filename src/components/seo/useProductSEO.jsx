import { useEffect } from 'react';

export function useProductSEO(product, type) {
  useEffect(() => {
    if (!product) return;

    const name = product.name || product.title;
    const description = product.description;
    const category = product.category;

    // Generate optimized title
    const title = `${name} - ${category} | JS-INNOV.IA`;
    document.title = title;

    // Generate optimized meta description
    const metaDescription = `${description?.substring(0, 150)}... Découvrez ${name} dans notre catalogue ${category}. Solutions IA professionnelles par JS-INNOV.IA.`;
    
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.name = 'description';
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.content = metaDescription;

    // Keywords
    const keywords = [
      name,
      category,
      'intelligence artificielle',
      'IA',
      type === 'innovation' ? 'innovation' : '',
      type === 'template' ? 'template vidéo' : '',
      type === 'automation' ? 'automatisation' : '',
      type === 'application' ? 'application IA' : ''
    ].filter(Boolean).join(', ');

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: metaDescription },
      { property: 'og:type', content: type === 'innovation' ? 'article' : 'product' },
      { property: 'og:image', content: product.image_url || product.preview_url || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png' }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });

    // Schema.org structured data
    let schemaScript = document.getElementById('product-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'product-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schema = generateSchema(product, type);
    schemaScript.textContent = JSON.stringify(schema);

    // Cleanup function
    return () => {
      const schemaEl = document.getElementById('product-schema');
      if (schemaEl) schemaEl.remove();
    };
  }, [product, type]);
}

function generateSchema(product, type) {
  const baseUrl = window.location.origin;
  const name = product.name || product.title;

  if (type === 'innovation') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: name,
      description: product.description,
      image: product.image_url,
      datePublished: product.created_date,
      author: {
        '@type': 'Organization',
        name: 'JS-INNOV.IA',
        url: baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'JS-INNOV.IA',
        logo: {
          '@type': 'ImageObject',
          url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png'
        }
      },
      articleSection: product.category,
      keywords: product.tags?.join(', ')
    };
  }

  // Product schema for templates, automations, applications
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: product.description,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'JS-INNOV.IA'
    }
  };

  if (product.image_url || product.preview_url) {
    schema.image = product.image_url || product.preview_url;
  }

  if (product.price && product.price > 0) {
    schema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'JS-INNOV.IA'
      }
    };
  }

  if (type === 'application' && product.status) {
    schema.offers = schema.offers || {};
    schema.offers.availability = product.status === 'Disponible' 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/PreOrder';
  }

  if (product.features || product.benefits) {
    schema.additionalProperty = (product.features || product.benefits)?.map(feature => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature
    }));
  }

  return schema;
}
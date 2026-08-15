import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { platform } from '@/api/platformClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import ReactMarkdown from 'react-markdown';
import {
  Calendar, Clock, Tag, ArrowLeft, Share2, ChevronRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => platform.entities.BlogPost.filter({ slug, status: 'publié' }),
    enabled: !!slug,
  });

  const post = posts[0];

  // Articles similaires
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related-posts', post?.category],
    queryFn: () => platform.entities.BlogPost.filter(
      { category: post.category, status: 'publié' },
      '-published_date',
      4
    ),
    enabled: !!post?.category,
  });

  const similarPosts = relatedPosts.filter(p => p.id !== post?.id).slice(0, 3);

  // Schema.org Article
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog JS-INNOV.IA`;

      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = post.excerpt || post.title;

      // Schema.org Article
      const existingSchema = document.querySelector('script[data-schema="article"]');
      if (existingSchema) existingSchema.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.cover_image,
        "datePublished": post.published_date,
        "author": {
          "@type": "Organization",
          "name": "JS-INNOV.IA"
        },
        "publisher": {
          "@type": "Organization",
          "name": "JS-INNOV.IA",
          "logo": {
            "@type": "ImageObject",
            "url": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png"
          }
        },
        "keywords": post.seo_keywords?.join(', ')
      };

      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-schema', 'article');
      schemaScript.text = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }
  }, [post]);

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="h-64 bg-white/10 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article non trouvé</h1>
          <Link to={createPageUrl('Blog')}>
            <Button>Retour au blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to={createPageUrl('Blog')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
              {post.category}
            </span>
            {post.ai_generated && (
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Généré par IA
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time || 5} min de lecture
            </span>
            {post.seo_score && (
              <span className="flex items-center gap-1 text-green-400">
                Score SEO: {post.seo_score}/100
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareArticle} className="gap-2">
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>
        </motion.header>

        {/* Image de couverture */}
        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl"
            />
          </motion.div>
        )}

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none mb-12"
        >
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-purple-500/30">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-white mt-8 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">{children}</ol>
              ),
              li: ({ children }) => <li className="text-gray-300">{children}</li>,
              strong: ({ children }) => <strong className="text-pink-400 font-semibold">{children}</strong>,
              a: ({ href, children }) => (
                <a href={href} className="text-purple-400 hover:text-pink-400 underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-400 my-6">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-purple-500/20 px-2 py-1 rounded text-pink-400 text-sm">
                  {children}
                </code>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mots-clés SEO */}
        {post.seo_keywords && post.seo_keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-12 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <h4 className="text-sm font-medium text-green-400 mb-2">Mots-clés SEO</h4>
            <p className="text-gray-400 text-sm">{post.seo_keywords.join(' • ')}</p>
          </motion.div>
        )}

        {/* Articles similaires */}
        {similarPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-t border-purple-500/20 pt-12"
          >
            <h3 className="text-xl font-bold text-white mb-6">Articles similaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={createPageUrl(`BlogPost?slug=${relatedPost.slug}`)}
                  className="group p-4 rounded-xl bg-white/5 border border-purple-500/20 hover:border-pink-500/50 transition-all"
                >
                  <h4 className="font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2 mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-gray-500 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  <span className="text-pink-400 text-sm mt-2 flex items-center gap-1">
                    Lire <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Cet article vous a été utile ?
          </h3>
          <p className="text-gray-400 mb-6">
            Contactez-nous pour discuter de vos projets d'automatisation et d'IA
          </p>
          <Link
            to={createPageUrl('Contact')}
            className="inline-block px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all"
          >
            Nous contacter
          </Link>
        </motion.div>
      </article>
    </div>
  );
}
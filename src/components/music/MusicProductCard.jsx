import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music, Clock, Activity, Check } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MusicProductCard({ product, index = 0, popular = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (!product.preview_url) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 transition-all duration-300">
        
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-900/30 to-purple-900/30">
          {product.cover_image ? (
            <img
              src={product.cover_image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-20 h-20 text-pink-400/50" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          {product.preview_url && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="p-4 rounded-full bg-pink-600 hover:bg-pink-700 transition-colors">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </div>
            </button>
          )}

          {/* Popular Badge */}
          {popular && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                ⭐ Populaire
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Style */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
              {product.title}
            </h3>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
              {product.style}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
            {product.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{product.duration}</span>
              </div>
            )}
            {product.bpm && (
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>{product.bpm} BPM</span>
              </div>
            )}
          </div>

          {/* License Type */}
          <div className="mb-4 p-3 rounded-lg bg-blue-600/10 border border-blue-500/20">
            <div className="text-xs font-semibold text-blue-300 mb-1">{product.license_type}</div>
            {product.features && product.features.length > 0 && (
              <div className="space-y-1">
                {product.features.slice(0, 2).map((feature, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                    <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ideal For */}
          {product.ideal_for && product.ideal_for.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Idéal pour :</div>
              <div className="flex flex-wrap gap-1">
                {product.ideal_for.slice(0, 3).map((use, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-md bg-pink-900/20 text-pink-300 border border-pink-500/20"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price & Checkout */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div>
              <div className="text-2xl font-bold text-white">{product.price}€</div>
              <div className="text-xs text-gray-500">Paiement unique</div>
            </div>
            <CheckoutButton
              productName={product.title}
              amount={product.price}
              stripePriceId={product.stripe_price_id}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            />
          </div>
        </div>

        {/* Hidden Audio Element */}
        {product.preview_url && (
          <audio
            ref={audioRef}
            src={product.preview_url}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </div>
    </motion.div>
  );
}
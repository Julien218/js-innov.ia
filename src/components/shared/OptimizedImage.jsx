
/**
 * Composant Image optimisé avec lazy loading et attributs alt obligatoires
 * Améliore la performance et l'accessibilité
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  ...props
}) {
  // Validation: alt est obligatoire pour l'accessibilité
  if (!alt) {
    console.warn('OptimizedImage: attribut alt manquant pour', src);
  }

  return (
    <img
      src={src}
      alt={alt || 'Image JS-INNOV.IA'}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
}
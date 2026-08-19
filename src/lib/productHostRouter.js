import { findProductByHostname } from '@/config/productEcosystem';

export function resolveProductExperience(hostname) {
  const product = findProductByHostname(hostname);

  if (!product || product.id === 'main') {
    return 'main';
  }

  return product.id;
}

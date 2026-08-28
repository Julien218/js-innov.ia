import { findProductByHostname } from '../config/productEcosystem.js';

export function resolveProductExperience(hostname) {
  const product = findProductByHostname(hostname);

  if (!product || product.id === 'main' || !product.hostRoutingEnabled) {
    return 'main';
  }

  return product.id;
}

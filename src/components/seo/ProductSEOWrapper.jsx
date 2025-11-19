import React, { useEffect } from 'react';
import { useProductSEO } from './useProductSEO';

export default function ProductSEOWrapper({ product, type, children }) {
  useProductSEO(product, type);
  return <>{children}</>;
}
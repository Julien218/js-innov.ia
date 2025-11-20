import React from 'react';
import { useShowcaseSEO } from './useShowcaseSEO';

export default function ShowcaseSEOWrapper({ project, children }) {
  useShowcaseSEO(project);
  return <>{children}</>;
}
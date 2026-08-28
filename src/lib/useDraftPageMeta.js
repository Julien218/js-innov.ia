import { useEffect } from 'react';

export function useDraftPageMeta(title) {
  useEffect(() => {
    const previousTitle = document.title;
    let robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute('content') ?? null;
    const createdRobots = !robots;

    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }

    document.title = title;
    robots.setAttribute('content', 'noindex,nofollow,noarchive');

    return () => {
      document.title = previousTitle;
      if (createdRobots) {
        robots.remove();
      } else if (previousRobots !== null) {
        robots.setAttribute('content', previousRobots);
      }
    };
  }, [title]);
}

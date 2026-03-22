import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/mfd/', '/admin/'],
      },
      // Block known scraper/cloner bots
      {
        userAgent: ['HTTrack', 'WebCopier', 'WebZIP', 'Teleport', 'SiteSnagger', 'ProWebWalker', 'CheiRank', 'SiteExplorer', 'Offline Explorer', 'BlackWidow', 'Widow', 'Xaldon', 'Zeus', 'CopyRightCheck', 'Bolt', 'WebReaper', 'WebSauger', 'Wget', 'curl'],
        disallow: '/',
      },
    ],
    sitemap: 'https://www.merasip.com/sitemap.xml',
  };
}

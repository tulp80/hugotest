import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, squooshImageService } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from '@playform/compress';
import astrowind from './vendor/integration';
import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hasExternalScripts = false;
const whenExternalScripts = (items = []) => hasExternalScripts ? Array.isArray(items) ? items.map(item => item()) : [items()] : []; 

export default defineConfig({
	output: 'hybrid',
	adapter: vercel({
		webAnalytics: { enabled: true },
		maxDuration: 8
	}),
	site: 'https://www.ayaselva.com',
	trailingSlash: 'never',
	integrations: [
		tailwind({
			applyBaseStyles: false
		}),
		sitemap({
			changefreq: 'daily',
			priority: 0.7,
			lastmod: new Date(),
			filter: (page) => {
			  const excludePattern = /^https:\/\/www\.ayaselva\.com\/(testa(\/\d*|00\d*)?|category\/.*|tag\/.*)$/;
			  const excludeFixed = [
				 'https://www.ayaselva.com/template',
				 'https://www.ayaselva.com/testcaptcha'
			  ];
			  const includeFixed = [
				 'https://www.ayaselva.com/forms/contact'
			  ];
			  return (includeFixed.includes(page) || (!excludePattern.test(page) && !excludeFixed.includes(page)));
			}
		 }),
		 
		mdx(),
		icon({
			include: {
				tabler: ['*'],
				'flat-color-icons': [
					'template',
					'gallery',
					'approval',
					'document',
					'advertising',
					'currency-exchange',
					'voice-presentation',
					'business-contact',
					'database'
				]
			}
		}),
		...whenExternalScripts(() => partytown({
			config: {
				forward: ['dataLayer.push']
			}
		})),
		compress({
			CSS: true,
			HTML: {
				'html-minifier-terser': {
					removeAttributeQuotes: false
				}
			},
			Image: false,
			JavaScript: true,
			SVG: false,
			Logger: 1
		}),
		astrowind({
			config: "./src/config.yaml"
		})
	],
	image: {
		service: squooshImageService(),
		domains: ["cdn.pixabay.com"]
	},
	markdown: {
		remarkPlugins: [readingTimeRemarkPlugin],
		rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin]
	},
	vite: {
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src')
			}
		},
		cacheDir: './buildcache'
	}
});

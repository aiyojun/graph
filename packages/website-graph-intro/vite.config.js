import path from 'path';
import { defineConfig } from 'vite'

const resolve = (dir) => path.resolve(__dirname, dir);

export default defineConfig({
	mode: 'production',
	root: resolve('.'),
	base: './',
	publicDir: resolve('public'),
	server: {
		host: '0.0.0.0',
		port: 8080,
		hmr: true,
		open: true,
		proxy: {
			'/star-service': {
				target: 'http://127.0.0.1:8090',
				changeOrigin: true,
				rewrite: p => p.replace(/^\/star-service/, '')
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve('src'),
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		}
	},
	plugins: [

	],
	build: {
		outDir: resolve('dist'),
	}
})

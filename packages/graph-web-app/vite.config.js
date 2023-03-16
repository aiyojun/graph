import path from 'path';
import { defineConfig } from 'vite'

const resolve = (dir) => path.resolve(__dirname, dir);

export default defineConfig({
	mode: 'production',
	root: resolve('.'),
	base: './',
	publicDir: resolve('public'),
	resolve: {
		alias: {
			'@': resolve('src'),
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		}
	},
	plugins: [

	],
	server: {
		host: '0.0.0.0',
		strictPort: true,
		port: 8080,
	},
	build: {
		outDir: resolve('dist'),
	}
})

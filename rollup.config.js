import fs from 'fs'
import path from 'path'
import vue from 'rollup-plugin-vue'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import PostCSS from 'rollup-plugin-postcss'
import simplevars from 'postcss-simple-vars'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import url from '@rollup/plugin-url'
import nested from 'postcss-nested'
import { terser } from 'rollup-plugin-terser'
import autoprefixer from 'autoprefixer'
import typescript from 'rollup-plugin-typescript2'
import css from 'rollup-plugin-css-only'

const name = 'modal'

const postcssConfigList = [
	postcssImport({
		resolve(id, basedir) {
			if (id.startsWith('@css')) return path.resolve('./src/assets/styles/css', id.slice(5))
			if (id.startsWith('~')) return path.resolve('./node_modules', id.slice(1))
			return path.resolve(basedir, id)
		}
	}),
	simplevars, nested,
	postcssUrl({ url: 'inline' }),
	autoprefixer({ overrideBrowserslist: '> 1%, IE 6, Explorer >= 10, Safari >= 7' })
]

const projectRoot = path.resolve(__dirname, '.')

let postVueConfig = [
	PostCSS({
		modules: { generateScopedName: '[local]___[hash:base64:5]' },
		include: /&module=.*\.css$/,
	}),
	PostCSS({
		include: /(?<!&module=.*)\.css$/,
		plugins:[ ...postcssConfigList ]
	}),
	url({ include: ['**/*.svg', '**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'] }),
]

if (process.env.SEP_CSS) postVueConfig = [css({ output: './dist/bundle.css' }), ...postVueConfig]


const baseConfig = {
	plugins: {
		preVue: [
			alias({
				entries: [
					{
						find: '@',
						replacement: `${path.resolve(projectRoot, 'src')}`
					}
				],
				customResolver: resolve({ extensions: ['.js', '.jsx', '.vue'] })
			})
		],
		replace: {
			'process.env.NODE_ENV': JSON.stringify('production'),
			__VUE_OPTIONS_API__: JSON.stringify(true),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
			preventAssignment: true
		},
		vue: {
			target: 'browser',
			preprocessStyles: process.env.SEP_CSS ? false : true,
			postcssPlugins: [...postcssConfigList]
		},
		postVue: [
			...postVueConfig
		],
		babel: {
			exclude: 'node_modules/**',
			extensions: ['.js', '.jsx', '.vue'],
			babelHelpers: 'bundled'
		}
	}
}

const external = [
	// list external dependencies, exactly the way it is written in the import statement.
	// eg. 'jquery'
	'vue'
]

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
	// Provide global variable names to replace your external imports
	// eg. jquery: '$'
	vue: 'Vue'
}

const baseFolder = './src/'
const componentsFolder = 'components/'

const components = fs
	.readdirSync(baseFolder + componentsFolder)
	.filter((f) => fs.statSync(path.join(baseFolder + componentsFolder, f)).isDirectory())

const entriespath = {
	index: './src/index.ts',
	...components.reduce((obj, name) => {
		obj[name] = baseFolder + componentsFolder + name + '/index.ts'
		return obj
	}, {})
}

const capitalize = (s) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}


const mapComponent = (name) => {
	return [
		{
			input: baseFolder + componentsFolder + `${name}/index.ts`,
			external,
			output: {
				format: 'umd',
				name: capitalize(name),
				file: `dist/components/${name}/index.ts`,
				exports: 'named',
				globals
			},
			plugins: [
				typescript(),
				...baseConfig.plugins.preVue,
				vue({}),
				...baseConfig.plugins.postVue,
				babel({
					...baseConfig.plugins.babel,
					presets: [['@babel/preset-env', { modules: false }]]
				}),
				commonjs()
			]
		}
	]
}
const esConfig = {
	input: entriespath,
	external,
	output: {
		format: 'esm',
		dir: 'dist/esm'
	},
	plugins: [
		typescript(),
		replace(baseConfig.plugins.replace),
		...baseConfig.plugins.preVue,
		vue(baseConfig.plugins.vue),
		...baseConfig.plugins.postVue,
		babel({
			...baseConfig.plugins.babel,
			presets: [['@babel/preset-env', { modules: false }]]
		}),
		commonjs(),
	]
}

const merged = {
	input: 'src/index.ts',
	external,
	output: {
		format: 'esm',
		file: `dist/${name}.esm.js`
	},
	plugins: [
		typescript(),
		replace(baseConfig.plugins.replace),
		...baseConfig.plugins.preVue,
		vue(baseConfig.plugins.vue),
		...baseConfig.plugins.postVue,
		babel({
			...baseConfig.plugins.babel,
			presets: [['@babel/preset-env', { modules: false }]]
		}),
		commonjs(),
	]
}
const ind = [
	...components.map((f) => mapComponent(f)).reduce((r, a) => r.concat(a), [])
]

const unpkgConfig = {
	...baseConfig,
	input: './src/index.ts',
	external,
	output: {
		compact: true,
		file: `dist/${name}-browser.min.js`,
		format: 'iife',
		name,
		exports: 'named',
		globals
	},
	plugins: [
		typescript(),
		replace(baseConfig.plugins.replace),
		...baseConfig.plugins.preVue,
		vue(baseConfig.plugins.vue),
		...baseConfig.plugins.postVue,
		babel(baseConfig.plugins.babel),
		commonjs(),
		terser({
			output: {
				ecma: 5
			}
		})
	]
}

const cjsConfig = {
	...baseConfig,
	input: entriespath,
	external,
	output: {
		compact: true,
		format: 'cjs',
		dir: 'dist/cjs',
		exports: 'named',
		globals
	},
	plugins: [
		typescript(),
		replace(baseConfig.plugins.replace),
		...baseConfig.plugins.preVue,
		vue({
			...baseConfig.plugins.vue,
			template: {
				...baseConfig.plugins.vue.template,
				optimizeSSR: true
			}
		}),
		...baseConfig.plugins.postVue,
		babel(baseConfig.plugins.babel),
		commonjs(),
	]
}

export default [
	esConfig, merged, ...ind, unpkgConfig, cjsConfig
]
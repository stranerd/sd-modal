module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript'
	],
	parserOptions: {
		parser: '@typescript-eslint/parser'
	},
	rules: {
		'@typescript-eslint/no-unused-vars': 'error',
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'vue/no-v-html': 'off',
		'no-console': process.env.NODE_ENV === 'development' ? 'warn' : 'error',
		'no-debugger': 'warn',
		'no-tabs': 'off',
		'no-var': 'error',
		'accessor-pairs': 'off',
		'no-use-before-define': 'off',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		semi: ['error', 'never'],
		quotes: ['error', 'single'],
		'prefer-const': ['error'],
		'arrow-parens': ['error', 'always'],
		'no-return-assign': 'off',
		curly: 'off',
		'vue/html-indent': ['warn', 'tab', {
			attribute: 1,
			baseIndent: 1,
			closeBracket: 0,
			alignAttributesVertically: true,
			ignores: []
		}],
		'vue/no-mutating-props': 'off',
		'object-property-newline': 'off',
		'require-atomic-updates': 'off',
		'require-await': 'off'
	},
	overrides: [
		{
			files: ['tests/**/*.[jt]s?(x)', 'tests/**/*.spec.[jt]s?(x)'],
			env: {
				jest: true,
			},
		},
	]
}

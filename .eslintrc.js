module.exports = {
	env: {
		node: true,
		es6: true,
		jest: true
	},
	extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
	parserOptions: {
		project: "./tsconfig.json"
	},
	rules:{
		'no-console': 'off'
	}
}
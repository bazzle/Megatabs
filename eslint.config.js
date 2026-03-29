import stylistic from '@stylistic/eslint-plugin'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

const settings = [
	...compat.extends('next/core-web-vitals'),
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: { '@stylistic': stylistic },
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/semi': ['error', 'never'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/eol-last': ['error', 'always'],
			'@stylistic/no-multiple-empty-lines': ['error', { 'max': 1 }],
			'@stylistic/arrow-spacing': 'error',
			'@stylistic/block-spacing': 'error',
			'@stylistic/comma-spacing': ['error', { 'before': false, 'after': true }],
			'@stylistic/key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
			'@stylistic/keyword-spacing': ['error', { 'before': true, 'after': true }],
			'@stylistic/space-infix-ops': 'error',
			'@stylistic/object-curly-spacing': ['error', 'always'],
		},
	},
]

export default settings

import { defineConfig } from "eslint/config"
import prettier from "eslint-config-prettier/flat"
import standard from "eslint-config-standard"
import importPlugin from "eslint-plugin-import"
import nPlugin from "eslint-plugin-n"
import promisePlugin from "eslint-plugin-promise"
import globals from "globals"

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				testRule: `readonly`,
			},
			ecmaVersion: `latest`,
			sourceType: `module`,
		},
		plugins: {
			"import": importPlugin,
			"n": nPlugin,
			"promise": promisePlugin,
		},
		rules: standard.rules,
	},
	prettier,
])

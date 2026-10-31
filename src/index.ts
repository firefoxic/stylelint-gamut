import Color from "colorjs.io"
import stylelint from "stylelint"

import { declarationValueIndex, isInColorGamutP3MediaQuery, isInColorGamutRec2020MediaQuery, isStandardSyntaxProperty, startsWithNumber } from "./utils.js"

const ruleName = `gamut/color-no-out-gamut-range`

const messages = stylelint.utils.ruleMessages(ruleName, {
	rejected: (color) => `Unexpected color out of gamut range "${color}"`,
})

const meta = { url: `https://github.com/fpetrakov/stylelint-gamut/blob/master/src/README.md` }

/**
 * Extract supported color and variable function calls from a CSS value.
 *
 * @param value - The CSS value to scan.
 * @returns The complete function calls found in the value.
 */
function getFunctionCalls (value: string): string[] {
	let matches: string[] = []
	let pattern = /(oklch|oklab|lab|lch|var)\s*\(/ugi

	for (let match; (match = pattern.exec(value));) {
		let start = match.index
		let openIndex = start + match[0].length - 1
		let depth = 0
		let end = -1

		for (let i = openIndex; i < value.length; i += 1) {
			if (value[i] === `(`) depth += 1
			else if (value[i] === `)`) {
				depth -= 1
				if (depth === 0) {
					end = i + 1
					break
				}
			}
		}

		if (end !== -1) {
			matches.push(value.slice(start, end))
			pattern.lastIndex = end
		}
	}

	return matches
}

/**
 * Split a string at its first comma outside parentheses.
 *
 * @param value - The string to split.
 * @returns The content before and after the top-level comma.
 */
function splitAtTopLevelComma (value: string): [string, string] {
	let depth = 0

	for (let i = 0; i < value.length; i += 1) {
		let char = value[i]

		if (char === `(`) depth += 1
		else if (char === `)`) depth -= 1
		else if (char === `,` && depth === 0) return [value.slice(0, i), value.slice(i + 1)]
	}

	return [value, ``]
}

/**
 * Check whether a value starts with a custom-property `var()` function.
 *
 * @param value - The value to check.
 * @returns Whether the value starts with `var(--...)`.
 */
function startsWithVarFunction (value: string): boolean {
	return (/^var\s*\(\s*--/u).test(value)
}

/**
 * Resolve a custom-property reference or its fallback value.
 *
 * @param value - The value that may contain a custom-property reference.
 * @param customProperties - Known custom-property values.
 * @param seen - Names already resolved to prevent circular references.
 * @returns The resolved value, or an empty string when it cannot be resolved.
 */
function resolveCustomPropertyValue (
	value: string,
	customProperties: Record<string, { value: string, inQuery: boolean }>,
	seen: Set<string> = new Set(),
): string {
	if (!startsWithVarFunction(value)) return value

	let inner = value.slice(value.indexOf(`(`) + 1, -1).trim()
	let [name, fallback = ``] = splitAtTopLevelComma(inner)
	let varName = name.trim()

	if (seen.has(varName)) return ``

	seen.add(varName)

	if (customProperties[varName] && !customProperties[varName].inQuery) {
		return resolveCustomPropertyValue(
			customProperties[varName].value,
			customProperties,
			seen,
		)
	}

	if (fallback.trim()) {
		return resolveCustomPropertyValue(
			fallback.trim(),
			customProperties,
			seen,
		)
	}

	return ``
}

/**
 * Create the Stylelint rule visitor for the supplied configuration.
 *
 * @param primary - The rule's primary configuration option.
 * @returns The rule visitor.
 */
function ruleFunction (primary: unknown): ReturnType<stylelint.Rule> {
	return (root, result) => {
		let validOptions = stylelint.utils.validateOptions(result, ruleName, { actual: primary })

		if (!validOptions) return

		let customProperties: Record<string, { value: string, inQuery: boolean }> = {}

		root.walkDecls((decl) => {
			if (!isStandardSyntaxProperty(decl.prop)) return

			let values = getFunctionCalls(decl.value)

			if (values.length === 0) return

			// value is e.g. lch(48% 82 283 / 67%)
			for (let value of values) check(value)

			/**
			 * Report the value if its color is outside the permitted gamut.
			 *
			 * @param value - The color function call to check.
			 * @returns Nothing.
			 */
			function check (value: string): void {
				let shouldBeIgnored = !startsWithVarFunction(value) && ((/var\s*\(\s*--/u).test(value) || !startsWithNumber(value.split(`(`)[1]))

				if (shouldBeIgnored) return

				let resolvedValue = resolveCustomPropertyValue(
					value,
					customProperties,
				)
				if (!resolvedValue) return

				let color = new Color(resolvedValue)

				if (color.inGamut(`srgb`)) return
				if (color.inGamut(`p3`) && isInColorGamutP3MediaQuery(decl)) return
				if (color.inGamut(`rec2020`) && isInColorGamutRec2020MediaQuery(decl)) return
				if (decl.prop && decl.prop.startsWith(`--`)) {
					customProperties[decl.prop] = {
						value: decl.value.trim(),
						inQuery: false,
					}
					return
				}

				let index = declarationValueIndex(decl)
				let endIndex = index + decl.value.length
				stylelint.utils.report({
					message: messages.rejected(value),
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				})
			}
		})
	}
}

const rule: stylelint.Rule = Object.assign(ruleFunction, { ruleName, messages, meta })

const plugin = stylelint.createPlugin(ruleName, rule)

export default plugin
export { messages, meta, ruleName }

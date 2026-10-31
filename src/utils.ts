import type { AtRule, Declaration, Node } from "postcss"

/**
 * Get the index where a declaration's value begins.
 *
 * @param decl - The declaration to inspect.
 * @returns The index where the declaration value begins.
 */
export function declarationValueIndex (decl: Declaration): number {
	let raws = decl.raws

	let index = 0

	for (let str of [
		getRawString(raws.prop, `prefix`),
		getRawString(raws.prop, `raw`) || decl.prop,
		getRawString(raws.prop, `suffix`),
		raws.between || `:`,
		getRawString(raws.value, `prefix`),
	]) if (str) index += str.length

	return index
}

/**
 * Check whether a property uses standard CSS syntax.
 *
 * @param property - The property name to check.
 * @returns Whether the property uses standard CSS syntax.
 */
export function isStandardSyntaxProperty (property: string): boolean {
	// SCSS var (e.g. $var: x), list (e.g. $list: (x)) or map (e.g. $map: (key:value))
	if (property.startsWith(`$`)) return false

	// Less var (e.g. @var: x)
	if (property.startsWith(`@`)) return false

	// SCSS or Less interpolation
	if ((/#\{.+?\}|@\{.+?\}|\$\(.+?\)/u).test(property)) return false

	return true
}

/**
 * Check whether a declaration is inside a P3 color-gamut media query.
 *
 * @param decl - The declaration to inspect.
 * @returns Whether the declaration is inside a P3 media query.
 */
export function isInColorGamutP3MediaQuery (decl: Declaration): boolean {
	let parentMediaQuery = getMediaQueryParent(decl)

	if (parentMediaQuery && (/\(color-gamut:\s*p3\)/u).test(parentMediaQuery.params)) return true

	return false
}

/**
 * Check whether a declaration is inside a Rec. 2020 color-gamut media query.
 *
 * @param decl - The declaration to inspect.
 * @returns Whether the declaration is inside a Rec. 2020 media query.
 */
export function isInColorGamutRec2020MediaQuery (decl: Declaration): boolean {
	let parentMediaQuery = getMediaQueryParent(decl)

	if (parentMediaQuery && (/\(color-gamut:\s*rec2020\)/u).test(parentMediaQuery.params)) return true

	return false
}

/**
 * Find the media-query ancestor of a declaration, if it has one.
 *
 * @param decl - The declaration to inspect.
 * @returns The media-query ancestor, or false if none exists.
 */
function getMediaQueryParent (decl: Declaration): AtRule | false {
	let parent = decl.parent

	if (parent && isMediaQuery(parent)) return parent

	let grandparent = parent?.parent

	return isMediaQuery(grandparent) ? grandparent : false
}

/**
 * Check whether a PostCSS node is a media at-rule.
 *
 * @param node - The node to check.
 * @returns Whether the node is a media at-rule.
 */
function isMediaQuery (node: Node | undefined): node is AtRule {
	return node?.type === `atrule` && `name` in node && node.name === `media`
}

/**
 * Check whether a value begins with a number after trimming whitespace.
 *
 * @param str - The value to check.
 * @returns Whether the trimmed value starts with a digit.
 */
export function startsWithNumber (str: unknown): boolean {
	return (/^\d/u).test(String(str).trim())
}

function getRawString (value: unknown, property: string): string | undefined {
	if (value === null || typeof value !== `object`) return undefined

	let rawValue = Reflect.get(value, property)

	return typeof rawValue === `string` ? rawValue : undefined
}

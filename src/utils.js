/**
 * Get the index where a declaration's value begins.
 *
 * @param {import('postcss').Declaration} decl - The declaration to inspect.
 * @returns {number} The index where the declaration value begins.
 */
export function declarationValueIndex (decl) {
	let raws = decl.raws

	let index = 0

	for (let str of [
		raws.prop && raws.prop.prefix,
		(raws.prop && raws.prop.raw) || decl.prop,
		raws.prop && raws.prop.suffix,
		raws.between || `:`,
		raws.value && raws.value.prefix,
	]) if (str) index += str.length

	return index
}

/**
 * Check whether a property uses standard CSS syntax.
 *
 * @param {string} property - The property name to check.
 * @returns {boolean} Whether the property uses standard CSS syntax.
 */
export function isStandardSyntaxProperty (property) {
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
 * @param {import('postcss').Declaration} decl - The declaration to inspect.
 * @returns {boolean} Whether the declaration is inside a P3 media query.
 */
export function isInColorGamutP3MediaQuery (decl) {
	let parentMediaQuery = getMediaQueryParent(decl)

	if (parentMediaQuery && (/\(color-gamut:\s*p3\)/u).test(parentMediaQuery.params)) return true

	return false
}

/**
 * Check whether a declaration is inside a Rec. 2020 color-gamut media query.
 *
 * @param {import('postcss').Declaration} decl - The declaration to inspect.
 * @returns {boolean} Whether the declaration is inside a Rec. 2020 media query.
 */
export function isInColorGamutRec2020MediaQuery (decl) {
	let parentMediaQuery = getMediaQueryParent(decl)

	if (parentMediaQuery && (/\(color-gamut:\s*rec2020\)/u).test(parentMediaQuery.params)) return true

	return false
}

/**
 * Find the media-query ancestor of a declaration, if it has one.
 *
 * @param {import('postcss').Declaration} decl - The declaration to inspect.
 * @returns {import('postcss').AtRule | false} The media-query ancestor, or `false` if none exists.
 */
function getMediaQueryParent (decl) {
	let parent = decl.parent

	if (parent && isMediaQuery(parent)) return parent

	parent = parent.parent

	return isMediaQuery(parent) && parent
}

/**
 * Check whether a PostCSS node is a media at-rule.
 *
 * @param {import('postcss').Node} decl - The node to check.
 * @returns {boolean} Whether the node is a media at-rule.
 */
function isMediaQuery (decl) {
	return decl.type === `atrule` && decl.name === `media`
}

/**
 * Check whether a value begins with a number after trimming whitespace.
 *
 * @param {unknown} str - The value to check.
 * @returns {boolean} Whether the trimmed value starts with a digit.
 */
export function startsWithNumber (str) {
	return (/^\d/u).test(String(str).trim())
}

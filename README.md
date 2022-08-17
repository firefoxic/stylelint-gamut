# @firefoxic/stylelint-gamut

<img src="./logo/logo.png" width="100" height="100" alt="" align="right">

[![License: MIT][license-image]][license-url]
[![Changelog][changelog-image]][changelog-url]
[![Test Status][test-image]][test-url]

A [Stylelint] plugin that helps you to work with different color spaces.

## Rules

- [`color-no-out-gamut-range`](./src/README.md): Throw warning if color goes out of sRGB color space and is not wrapped in `@media (color-gamut: p3) {}` or `@media (color-gamut: rec2020) {}`.

## Usage

1. Install `@firefoxic/stylelint-gamut`:

	```sh
	pnpm add -D @firefoxic/stylelint-gamut
	```

2. Add `@firefoxic/stylelint-gamut` to your Stylelint config `plugins` array, then add rules you need to the rules list. All rules from `@firefoxic/stylelint-gamut` need to be namespaced with `gamut`.

	```js
	export default {
		"plugins": ["@firefoxic/stylelint-gamut"],
		"rules": {
			"gamut/color-no-out-gamut-range": true,
		},
	}
	```

## More

Read more about color spaces in css:

- [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [LCH colors in CSS: what, why, and how?](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
- [A Guide To Modern CSS Colors](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/)
- [Better dynamic themes in Tailwind with OKLCH color magic](https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic)

[Stylelint]: https://stylelint.io/

[license-url]: https://github.com/firefoxic/stylelint-gamut/blob/main/LICENSE.md
[license-image]: https://img.shields.io/badge/License-MIT-limegreen.svg

[changelog-url]: https://github.com/firefoxic/stylelint-gamut/blob/main/CHANGELOG.md
[changelog-image]: https://img.shields.io/badge/CHANGELOG-md-limegreen

[test-url]: https://github.com/firefoxic/stylelint-gamut/actions
[test-image]: https://github.com/firefoxic/stylelint-gamut/actions/workflows/test.yaml/badge.svg?branch=main

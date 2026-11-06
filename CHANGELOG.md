<!-- markdownlint-disable MD007 MD024 -->
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com), and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

## [1.0.1] — 2026–11–06

### Fixed

- The `gamut/color-no-out-gamut-range` rule no longer crashes on non-color values in `var()` fallbacks.

## [1.0.0] — 2026–11–03

### Changed

- A fork of the project <https://github.com/fpetrakov/stylelint-gamut> has been created.
- The config now requires `stylelint` version `18.0.0` or higher.

### Fixed

- The `gamut/color-no-out-gamut-range` rule now correctly checks colors in `var()` fallback values, including nested color functions.

[Unreleased]: https://github.com/firefoxic/stylelint-gamut/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/firefoxic/stylelint-gamut/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/firefoxic/stylelint-gamut/compare/v0.0.1...v1.0.0

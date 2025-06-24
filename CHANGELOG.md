# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

## [1.0.1] - 2024-12-19

### Added
- Initial stable release
- Core Result types and functions (`Ok<T>`, `Err`, `Result<T>`)
- Type guards (`isOk`, `isErr`)
- Utility functions (`unwrap`, `map`, `mapErr`)
- Async support with `tryResult` for wrapping async operations
- Assertion helpers (`assert`, `assertOr`, `assertNotNil`)
- Full TypeScript support with comprehensive type definitions
- Zero-dependency implementation
- Comprehensive test suite with Jest
- JSDoc documentation with TypeDoc generation
- Complete README with real-world usage examples

### Features
- **Rust-style Result types** - `Ok<T>` and `Err` with full TypeScript support
- **Type-safe error handling** - No more throwing exceptions everywhere
- **Functional utilities** - `map`, `mapErr`, `unwrap`, and more
- **Async support** - `tryResult` for wrapping async operations
- **Assertion helpers** - `assert`, `assertOr`, `assertNotNil` with Result returns
- **Zero dependencies** - Lightweight and tree-shakeable
- **TypeScript-first** - Full type safety and IntelliSense support

## [1.0.0] - 2024-12-19

### Added
- Initial release
- Core Result types and functions 💎
- Async support with `tryResult` 🌊
- Assertion helpers 🧪
- Full TypeScript support 🔵

---

## Version History

- **1.0.1** - First stable release with comprehensive documentation and testing
- **1.0.0** - Initial release with core functionality

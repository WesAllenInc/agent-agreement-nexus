# Changelog

## [Unreleased]

### Performance Optimizations
- **Bundle Size Reduction**: Reduced main bundle size by 50.2% (from 616.37 kB to 307.05 kB)
- **Code Splitting**: Implemented manual chunks for vendor, UI, charts, and forms
- **Lazy Loading**: All routes now use React.lazy with improved loading skeletons
- **Component Optimization**: 
  - PdfViewer component split into smaller, memoized components
  - Added useCallback for event handlers
  - Implemented proper TypeScript interfaces
- **Tree Shaking**: Added sideEffects: false to package.json
- **ESM Support**: Added type: module to package.json
- **Build Configuration**: Updated Vite config for better optimization

### Fixed
- Fixed Vercel build warnings:
  - Locked Node.js engine to fixed LTS version (18.x) to prevent unexpected upgrades
  - Updated Tailwind CSS content configuration to include index.html and all source file globs
  - Migrated from Vite's CJS API usage to ESM imports in build configurations
  - Updated plugins in tailwind.config.ts to use ESM imports instead of require statements

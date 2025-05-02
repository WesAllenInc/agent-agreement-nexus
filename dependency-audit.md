# Dependency Audit

## Potential Optimizations

1. **UI Component Library Consolidation**
   - Multiple Radix UI packages could be consolidated
   - Consider using the new `@radix-ui/react` unified package

2. **Redundant Packages**
   - `tailwind-merge` and `class-variance-authority` serve similar purposes
   - Both `@tailwindcss/forms` and `@tailwindcss/typography` may not be fully utilized

3. **Version Upgrades**
   - React 18.3.1 is current, but could benefit from performance optimizations
   - Vite 5.4.19 has newer versions available with better tree-shaking

4. **Large Dependencies**
   - `recharts` (2.15.3) - Consider lazy loading
   - `framer-motion` (11.18.2) - Consider code splitting
   - `react-pdf` (9.2.1) - Only load when needed

5. **Development Dependencies in Production**
   - Storybook and related packages should be moved to devDependencies
   - Test utilities should be in devDependencies

## Recommended Actions

1. Add `"sideEffects": false` to package.json for better tree-shaking
2. Implement code splitting for large components
3. Lazy load non-critical UI components
4. Move development tools to devDependencies
5. Update postcss.config.js to add `"type": "module"` to package.json

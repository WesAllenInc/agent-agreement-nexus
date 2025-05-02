# Performance Hotspots

## Bundle Size Analysis
1. **Main Bundle (index-BkpQq4dS.js)**: 314.08 kB (89.63 kB gzipped)
   - Still large despite code splitting
   - Contains application-specific code that could be further split

2. **UI Components (ui-CnlGvKy_.js)**: 137.31 kB (44.49 kB gzipped)
   - Contains all Radix UI components
   - Could be further optimized with more granular code splitting

3. **Vendor Bundle (vendor-DBfP7P-R.js)**: 164.20 kB (53.54 kB gzipped)
   - Contains React core libraries
   - Essential but could be optimized with better tree-shaking

## Component Hotspots
1. **PdfViewer Component** (`src/components/PdfViewer.tsx`)
   - Large component (412 lines)
   - Uses react-pdf which is externalized but still impacts performance
   - Could be lazy loaded

2. **Agreements Page** (`src/pages/Agreements.tsx`)
   - Large component (262 lines)
   - Contains multiple sub-components and complex logic
   - Could be split into smaller components

3. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Contains complex authentication logic
   - Has multiple exports that break fast refresh
   - Could be refactored for better performance

## JavaScript Performance Issues
1. **Type Issues**
   - Multiple `any` types in critical components
   - Missing type definitions impact optimization

2. **React Hook Dependencies**
   - Missing dependencies in useEffect hooks
   - Can cause unnecessary re-renders

## Recommended Actions
1. Implement lazy loading for PdfViewer component
2. Split Agreements page into smaller components
3. Refactor AuthContext for better performance
4. Fix type issues to improve optimization
5. Fix React hook dependencies

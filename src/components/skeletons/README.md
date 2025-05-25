# Skeleton Loading States

This directory contains skeleton loading components for the Agent Agreement Nexus application. These components provide visual placeholders during data loading to improve user experience by reducing perceived loading times and preventing layout shifts.

## Overview

Skeleton screens are a user experience pattern that displays a non-interactive preview of the page before data gets loaded. Instead of showing a loading spinner, skeleton screens mimic the layout of the page, creating a sense that the content is being progressively loaded.

## Base Components

The base skeleton components are defined in `src/components/ui/skeleton-enhanced.tsx` and include:

- `SkeletonText` - For text placeholders with configurable height and width
- `SkeletonCircle` - For circular placeholders (avatars, icons)
- `SkeletonRectangle` - For rectangular placeholders
- `SkeletonCard` - For card containers
- `SkeletonButton` - For button placeholders

All components support customizable dimensions through the `customWidth` and `customHeight` properties.

## Specialized Skeleton Components

The following specialized skeleton components are available:

- `AgreementCardSkeleton` - For agreement cards and lists
- `TableSkeleton` - For tables, with variants for user and agreement tables
- `DashboardSkeleton` - For the dashboard, including stats and charts
- `PdfViewerSkeleton` - For the PDF viewer interface
- `TrainingModuleSkeleton` - For training modules
- `UserProfileSkeleton` - For user profiles
- `NotificationSkeleton` - For notifications

## Usage

Import the skeleton components from the `@/components/skeletons` directory:

```tsx
import { AgreementCardSkeleton, DashboardSkeleton } from "@/components/skeletons"
```

Use them conditionally while data is loading:

```tsx
{isLoading ? (
  <DashboardSkeleton />
) : (
  // Your actual content here
)}
```

## Example Components

Example implementations are available in the `src/components/examples` directory:

- `AgreementListWithSkeleton` - Example of agreement list with skeleton loading
- `UserTableWithSkeleton` - Example of user table with skeleton loading
- `DashboardWithSkeleton` - Example of dashboard with skeleton loading
- `PdfViewerWithSkeleton` - Example of PDF viewer with skeleton loading
- `UserProfileWithSkeleton` - Example of user profile with skeleton loading

## Animation

The skeleton components use a shimmer animation defined in the Tailwind configuration:

```css
/* Defined in tailwind.config.ts */
animation: {
  shimmer: "shimmer 2s infinite",
},
keyframes: {
  shimmer: {
    "0%": {
      transform: "translateX(-100%)",
    },
    "100%": {
      transform: "translateX(100%)",
    },
  },
},
```

## Best Practices

1. **Match the layout** - Skeleton screens should closely match the layout of the actual content to prevent layout shifts.

2. **Use appropriate dimensions** - Use the `customWidth` and `customHeight` properties to match the expected dimensions of the actual content.

3. **Conditional rendering** - Always conditionally render skeleton components based on loading state.

4. **Avoid mixing** - Don't mix skeleton screens with traditional loading spinners in the same view.

5. **Timeout** - Consider adding a minimum display time (e.g., 500ms) to prevent flickering for very fast loads.

## Implementation Notes

- All width and height properties should use the predefined types or the custom dimension properties.
- The shimmer animation is applied through the `animate-shimmer` class and the gradient defined in the Tailwind configuration.
- For complex layouts, compose multiple skeleton components together rather than creating overly specific components.

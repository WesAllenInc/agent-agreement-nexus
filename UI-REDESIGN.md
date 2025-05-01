# UI Redesign Documentation

## Design System

### Colors
- Primary Greens
  - `green-primary`: #2D8B7D - Main actions, headers
  - `green-light`: #4CAF96 - Hover states
  - `green-dark`: #1B5E54 - Active states
- Accent Blues
  - `blue-accent`: #3B82F6 - Links, highlights
  - `blue-light`: #60A5FA - Secondary actions

### Typography
- Headings
  - H1: 2.5rem (40px), line-height: 1.2
  - H2: 2rem (32px), line-height: 1.3
  - H3: 1.5rem (24px), line-height: 1.4
  - H4: 1.25rem (20px), line-height: 1.5
- Body: 1rem (16px), line-height: 1.5
- Caption: 0.875rem (14px), line-height: 1.4

### Spacing
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)

## New Components

### DashboardCard
A consistent card component for dashboard sections with title and content areas.

```tsx
<DashboardCard title="Recent Activity">
  <ActivityList />
</DashboardCard>
```

### SearchWithAutocomplete
A reusable search component with debounced input and autocomplete suggestions.

```tsx
<SearchWithAutocomplete
  onSearch={searchAgreements}
  onSelect={handleSelect}
  renderItem={(item) => item.title}
/>
```

### StepIndicator
A progress indicator for multi-step forms with completed, current, and upcoming states.

```tsx
<StepIndicator
  steps={[
    { title: 'Details', status: 'completed' },
    { title: 'Review', status: 'current' },
    { title: 'Sign', status: 'upcoming' }
  ]}
  currentStep={1}
/>
```

## Implementation Notes

1. All new components use the updated design tokens from tailwind.config.ts
2. Mobile responsiveness is handled through Tailwind's breakpoint system
3. Accessibility features:
   - ARIA labels on interactive elements
   - Keyboard navigation support
   - Sufficient color contrast ratios
   - Focus indicators

## Migration Guide

1. Replace old card components with new DashboardCard
2. Update color classes to use new token names
3. Standardize typography using new text-* classes
4. Implement new spacing scale across layouts

# Agent Agreement Nexus Styleguide

## Upgraded Enterprise Features

### Global Components

| Component | File Path | Purpose | Design Tokens |
|-----------|-----------|---------|--------------|
| SearchBar | `src/components/common/SearchBar.tsx` | Global search accessible from all pages | `bg-gray-100`, `bg-white`, `border-blue-500` |
| Breadcrumbs | `src/components/common/Breadcrumbs.tsx` | Navigation path indicator | `text-gray-500`, `text-blue-600` |
| UserMenu | `src/components/common/UserMenu.tsx` | User profile dropdown with theme toggle | `bg-blue-500`, `border-gray-200` |
| NotificationsDropdown | `src/components/common/NotificationsDropdown.tsx` | Real-time alerts and notifications | `bg-red-500`, `bg-blue-50` |
| FilterPanel | `src/components/common/FilterPanel.tsx` | Advanced filtering for tables | `border-gray-200`, `bg-gray-50` |
| PaginatedTable | `src/components/common/PaginatedTable.tsx` | Data tables with pagination | `bg-blue-50`, `border-blue-500` |
| HelpWidget | `src/components/common/HelpWidget.tsx` | Contextual help system | `bg-blue-600`, `shadow-lg` |
| OnboardingWizard | `src/components/onboarding/OnboardingWizard.tsx` | First-time user tour | `bg-white`, `shadow-2xl` |

### Layout Components

| Component | File Path | Purpose |
|-----------|-----------|---------|
| MainLayout | `src/layouts/MainLayout.tsx` | Main application shell with header, navigation, and content area |

### Admin Components

| Component | File Path | Purpose |
|-----------|-----------|---------|
| AuditLogTable | `src/components/admin/AuditLogTable.tsx` | Activity tracking for admins |
| BulkExportModal | `src/components/admin/BulkExportModal.tsx` | Export data in various formats |
| BulkImportModal | `src/components/admin/BulkImportModal.tsx` | Import data from CSV |

### Settings Components

| Component | File Path | Purpose |
|-----------|-----------|---------|
| ProfileSettings | `src/pages/settings/Profile.tsx` | User profile management |
| SecuritySettings | `src/pages/settings/Security.tsx` | Password and 2FA management |
| Preferences | `src/pages/settings/Preferences.tsx` | User preferences including language |
| NotificationSettings | `src/pages/settings/Notifications.tsx` | Configure notification preferences |

## Accessibility Standards

All components should include:

- Properly labeled form elements with `label` or `aria-label`
- Focus states for interactive elements
- Keyboard navigation support
- ARIA attributes for dynamic content
- Color contrast ratios that meet WCAG 2.1 AA standards
- Skip links for keyboard users

## Internationalization (i18n)

- All user-facing text should be wrapped in the `t()` function
- Use the format: `t('namespace.key')` for consistency
- Keep keys organized by feature area

## Responsive Design

- Mobile-first approach using Tailwind breakpoints
- Components should adapt to different screen sizes
- Use `flex` and `grid` layouts for complex components
- Hamburger menu for mobile navigation

## Color System

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Primary | `blue-600` | `blue-500` | Buttons, links, active states |
| Secondary | `gray-500` | `gray-400` | Secondary text, icons |
| Background | `white`, `gray-100` | `gray-800`, `gray-900` | Page and component backgrounds |
| Text | `gray-900`, `gray-700` | `gray-100`, `gray-300` | Primary and secondary text |
| Success | `green-500` | `green-400` | Success states, confirmations |
| Warning | `yellow-500` | `yellow-400` | Warning states, alerts |
| Error | `red-500` | `red-400` | Error states, destructive actions |

## Typography

| Element | Font Size | Font Weight | Line Height | Usage |
|---------|-----------|-------------|-------------|-------|
| Heading 1 | `text-2xl` | `font-bold` | `leading-tight` | Page titles |
| Heading 2 | `text-xl` | `font-semibold` | `leading-tight` | Section headings |
| Heading 3 | `text-lg` | `font-medium` | `leading-normal` | Subsection headings |
| Body | `text-base` | `font-normal` | `leading-normal` | Main content |
| Small | `text-sm` | `font-normal` | `leading-normal` | Secondary content |
| Extra Small | `text-xs` | `font-normal` | `leading-normal` | Metadata, captions |

## Spacing

- Use Tailwind's spacing scale for consistency
- Common spacing values: `p-4`, `px-6`, `py-3`, `m-2`, `mt-4`, `mb-6`
- Maintain consistent spacing between related elements
- Use `space-y-4` and `space-x-4` utilities for consistent spacing between children

## Shadows

- Use Tailwind's shadow utilities for elevation
- Common shadow values: `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`
- Use shadows sparingly to indicate interactive elements or to create visual hierarchy

## Borders & Rounded Corners

- Use Tailwind's border utilities for consistent borders
- Common border values: `border`, `border-2`, `border-t`, `border-b`
- Common border radius values: `rounded`, `rounded-md`, `rounded-lg`, `rounded-full`
- Use border colors to indicate states: `border-gray-200`, `border-blue-500`, `border-red-500`

## Icons

- Use Lucide React icons for consistency
- Common icon sizes: `h-4 w-4`, `h-5 w-5`, `h-6 w-6`
- Use icons to enhance visual communication, not replace text
- Ensure icons have proper accessibility attributes

## Forms

- Use consistent form element styling
- Label all form elements properly
- Provide clear validation feedback
- Use consistent spacing between form elements
- Group related form elements together

## Buttons

| Type | Class | Usage |
|------|-------|-------|
| Primary | `bg-blue-600 hover:bg-blue-700 text-white` | Primary actions |
| Secondary | `bg-white border border-gray-300 text-gray-700` | Secondary actions |
| Danger | `bg-red-600 hover:bg-red-700 text-white` | Destructive actions |
| Ghost | `text-gray-700 hover:bg-gray-100` | Subtle actions |
| Link | `text-blue-600 hover:text-blue-500` | Navigation actions |

## Tables

- Use consistent table styling
- Include proper table headers with `<th>` elements
- Use zebra striping for better readability
- Include hover states for interactive rows
- Provide pagination for large datasets
- Include sorting and filtering capabilities

## Modals & Dialogs

- Use consistent modal styling
- Include proper focus management
- Provide clear actions (confirm, cancel)
- Use appropriate sizing based on content
- Include proper keyboard navigation
- Ensure modals are accessible

## Notifications & Alerts

| Type | Class | Usage |
|------|-------|-------|
| Info | `bg-blue-50 text-blue-800 border-blue-200` | Informational messages |
| Success | `bg-green-50 text-green-800 border-green-200` | Success messages |
| Warning | `bg-yellow-50 text-yellow-800 border-yellow-200` | Warning messages |
| Error | `bg-red-50 text-red-800 border-red-200` | Error messages |

## Dark Mode

- All components should support dark mode
- Use Tailwind's dark mode variants for consistent styling
- Test all components in both light and dark mode
- Ensure proper contrast ratios in both modes

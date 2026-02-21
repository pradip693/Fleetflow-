# Styling Guide (Tailwind CSS v4)

This document provides a deep dive into the styling architecture, custom theme configuration, and accessibility scaling used in this project.

## 1. Tailwind CSS v4 Architecture

In Tailwind v4, we no longer use a `tailwind.config.js` file. The entire configuration is managed via CSS decorators in `app/globals.css`.

### The `@theme` Directive
We use `@theme inline` to define custom design tokens. These are mapped to CSS variables and automatically become available as Tailwind classes.

```css
/* app/globals.css */
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --radius-lg: var(--radius);
}
```

## 2. Using Design Tokens

### Colors
Colors are defined using `oklch` for high-precision color reproduction.
- **Light Mode**: Defined in `:root`.
- **Dark Mode**: Defined in `.dark`.

**Usage in HTML/JSX:**
```tsx
<div className="bg-primary text-primary-foreground border-border">
  Content uses CSS variables via Tailwind classes.
</div>
```

### Radius
We use a base `--radius` variable (e.g., `0.625rem`) that automatically scales for `sm`, `md`, `lg`, and `xl` variants within the theme block.

## 3. Accessibility & Dynamic Scaling

This boilerplate features real-time UI scaling without page refreshes. This is achieved through root-level CSS variables in `globals.css`.

### Font Size Scaling
The application's base font size is calculated dynamically:
```css
html {
  font-size: calc(16px * var(--font-size-multiplier));
}
```
Updating the `--font-size-multiplier` (e.g., to `1.2` for 20% larger text) via Javascript will scale the entire UI proportionally.

### Spacing Scaling
Similarly, layout spacing can be adjusted globally:
```css
* {
  --spacing-scale: var(--spacing-multiplier);
}
```

## 4. Custom Styling (The `base` Layer)

Standard styles that apply to all elements are placed in `@layer base`. This is where we define:
- **Global Border Colors**: Ensuring all `border` classes use the theme's border color.
- **Body Defaults**: Standardizing text colors and backgrounds.
- **Custom Scrollbars**: A slim, theme-aware scrollbar implementation for a premium feel.

## 5. Adding New Tokens

To add a new custom color or spacing value:
1. Define the variable in `:root` and `.dark` blocks in `globals.css`.
2. Add it to the `@theme inline` block to generate the Tailwind class.

```css
:root {
  --brand-blue: oklch(0.6 0.1 220);
}

@theme inline {
  --color-brand: var(--brand-blue);
}

/* Now you can use <div className="text-brand"> */
```

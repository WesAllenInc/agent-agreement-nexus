/**
 * This script analyzes the codebase to find potentially unused Tailwind CSS classes
 * Run with: node scripts/analyze-tailwind-usage.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const sourceDir = path.resolve(__dirname, '../src');
const outputFile = path.resolve(__dirname, '../tailwind-usage-report.json');

// Tailwind utility patterns to look for
const tailwindPatterns = [
  'bg-[a-z0-9-]+',
  'text-[a-z0-9-]+',
  'border-[a-z0-9-]+',
  'p-[0-9]+',
  'px-[0-9]+',
  'py-[0-9]+',
  'm-[0-9]+',
  'mx-[0-9]+',
  'my-[0-9]+',
  'w-[a-z0-9-]+',
  'h-[a-z0-9-]+',
  'flex-[a-z0-9-]+',
  'grid-[a-z0-9-]+',
  'gap-[0-9]+',
  'rounded-[a-z0-9-]+',
  'shadow-[a-z0-9-]+',
  'opacity-[0-9]+',
  'z-[0-9]+',
  'transform-[a-z0-9-]+',
  'transition-[a-z0-9-]+',
  'duration-[0-9]+',
  'ease-[a-z0-9-]+',
  'animate-[a-z0-9-]+',
  'overflow-[a-z0-9-]+',
  'object-[a-z0-9-]+',
  'font-[a-z0-9-]+',
  'tracking-[a-z0-9-]+',
  'leading-[a-z0-9-]+',
  'list-[a-z0-9-]+',
  'whitespace-[a-z0-9-]+',
  'align-[a-z0-9-]+',
  'justify-[a-z0-9-]+',
  'items-[a-z0-9-]+',
  'content-[a-z0-9-]+',
  'self-[a-z0-9-]+',
  'order-[0-9]+',
  'col-[a-z0-9-]+',
  'row-[a-z0-9-]+',
  'space-[xy]-[0-9]+',
  'divide-[xy]-[0-9]+',
  'inset-[0-9]+',
  'top-[0-9]+',
  'right-[0-9]+',
  'bottom-[0-9]+',
  'left-[0-9]+',
  'scale-[0-9]+',
  'rotate-[0-9]+',
  'translate-[xy]-[0-9]+',
  'skew-[xy]-[0-9]+',
  'origin-[a-z0-9-]+',
  'cursor-[a-z0-9-]+',
  'select-[a-z0-9-]+',
  'resize-[a-z0-9-]+',
  'outline-[a-z0-9-]+',
  'ring-[a-z0-9-]+',
  'fill-[a-z0-9-]+',
  'stroke-[a-z0-9-]+',
  'sr-[a-z0-9-]+',
  'placeholder-[a-z0-9-]+',
  'from-[a-z0-9-]+',
  'via-[a-z0-9-]+',
  'to-[a-z0-9-]+',
  'gradient-[a-z0-9-]+',
  'backdrop-[a-z0-9-]+',
  'filter-[a-z0-9-]+',
  'blur-[a-z0-9-]+',
  'brightness-[0-9]+',
  'contrast-[0-9]+',
  'drop-shadow-[a-z0-9-]+',
  'grayscale-[0-9]+',
  'hue-rotate-[0-9]+',
  'invert-[0-9]+',
  'saturate-[0-9]+',
  'sepia-[0-9]+',
  'aspect-[a-z0-9-]+',
  'columns-[0-9]+',
  'break-[a-z0-9-]+',
  'box-[a-z0-9-]+',
  'float-[a-z0-9-]+',
  'clear-[a-z0-9-]+',
  'isolation-[a-z0-9-]+',
  'object-[a-z0-9-]+',
  'overflow-[a-z0-9-]+',
  'overscroll-[a-z0-9-]+',
  'position-[a-z0-9-]+',
  'visible',
  'invisible',
  'collapse',
  'static',
  'fixed',
  'absolute',
  'relative',
  'sticky',
  'block',
  'inline-block',
  'inline',
  'flex',
  'inline-flex',
  'table',
  'grid',
  'contents',
  'list-item',
  'hidden',
];

// Find all source files
const sourceFiles = glob.sync(`${sourceDir}/**/*.{js,jsx,ts,tsx}`);

// Analyze files
const classUsage = {};
const fileClassMap = {};

// Initialize class usage map
tailwindPatterns.forEach(pattern => {
  classUsage[pattern] = {
    pattern,
    count: 0,
    files: []
  };
});

// Process each file
sourceFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relativeFile = path.relative(sourceDir, file);
  fileClassMap[relativeFile] = [];
  
  // Check each pattern
  tailwindPatterns.forEach(pattern => {
    const regex = new RegExp(`\\b${pattern}\\b`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      classUsage[pattern].count += matches.length;
      classUsage[pattern].files.push(relativeFile);
      fileClassMap[relativeFile].push(pattern);
    }
  });
});

// Generate report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalPatterns: tailwindPatterns.length,
    totalFiles: sourceFiles.length,
    patternsWithNoUses: Object.values(classUsage).filter(item => item.count === 0).length,
    mostUsedPatterns: Object.values(classUsage)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(item => ({ pattern: item.pattern, count: item.count })),
  },
  patternUsage: classUsage,
  fileClassMap: fileClassMap
};

// Write report to file
fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));

console.log(`Analysis complete. Report written to ${outputFile}`);
console.log(`Summary: ${report.summary.totalPatterns} patterns analyzed across ${report.summary.totalFiles} files.`);
console.log(`${report.summary.patternsWithNoUses} patterns have no uses.`);
console.log('Top 10 most used patterns:');
report.summary.mostUsedPatterns.forEach((item, index) => {
  console.log(`${index + 1}. ${item.pattern}: ${item.count} uses`);
});

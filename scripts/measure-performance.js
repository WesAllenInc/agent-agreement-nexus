/**
 * Performance measurement script for Agent Agreement Nexus
 * Run with: node scripts/measure-performance.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const outputDir = path.resolve(__dirname, '../performance-reports');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportFile = path.join(outputDir, `performance-report-${timestamp}.json`);

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Measure build performance
console.log('Measuring build performance...');
const startBuildTime = Date.now();
try {
  execSync('npm run build', { stdio: 'inherit' });
  const endBuildTime = Date.now();
  const buildDuration = endBuildTime - startBuildTime;
  
  // Get bundle size information
  const distDir = path.resolve(__dirname, '../dist');
  const assetSizes = {};
  const totalSize = calculateDirSize(distDir);
  
  // Get individual file sizes
  const jsFiles = findFiles(distDir, '.js');
  const cssFiles = findFiles(distDir, '.css');
  
  jsFiles.forEach(file => {
    const relativePath = path.relative(distDir, file);
    const stats = fs.statSync(file);
    assetSizes[relativePath] = formatBytes(stats.size);
  });
  
  cssFiles.forEach(file => {
    const relativePath = path.relative(distDir, file);
    const stats = fs.statSync(file);
    assetSizes[relativePath] = formatBytes(stats.size);
  });
  
  // Generate report
  const report = {
    timestamp,
    buildPerformance: {
      duration: `${buildDuration}ms`,
      durationSeconds: (buildDuration / 1000).toFixed(2),
    },
    bundleSize: {
      total: formatBytes(totalSize),
      totalBytes: totalSize,
      assets: assetSizes,
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
    }
  };
  
  // Write report to file
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  console.log(`Performance report generated: ${reportFile}`);
  console.log(`Build time: ${report.buildPerformance.duration}`);
  console.log(`Total bundle size: ${report.bundleSize.total}`);
  
} catch (error) {
  console.error('Error measuring performance:', error);
  process.exit(1);
}

// Helper functions
function calculateDirSize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += calculateDirSize(filePath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

function findFiles(dirPath, extension) {
  let results = [];
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (path.extname(file) === extension) {
      results.push(filePath);
    }
  }
  
  return results;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

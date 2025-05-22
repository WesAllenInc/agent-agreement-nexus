@echo off
REM Batch script to run Chromatic with your project token
REM Replace YOUR_TOKEN_HERE with your actual Chromatic project token

set CHROMATIC_PROJECT_TOKEN=YOUR_TOKEN_HERE
npx chromatic --storybook-build-dir=storybook-static --exit-zero-on-changes --allow-console-errors --skip-storybook-build

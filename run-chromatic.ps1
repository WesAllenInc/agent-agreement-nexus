# PowerShell script to run Chromatic with your project token
# Updated with the provided token

$env:CHROMATIC_PROJECT_TOKEN="chpt_3572d277628e6a4"
npx chromatic --storybook-build-dir=storybook-static --exit-zero-on-changes --allow-console-errors --skip-storybook-build

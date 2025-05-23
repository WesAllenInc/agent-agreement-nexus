# PowerShell script to run Chromatic with the provided project token
# This script uses the token directly without requiring .env files

# Set the Chromatic project token
$env:CHROMATIC_PROJECT_TOKEN="chpt_3572d277628e6a4"

# First build Storybook
Write-Host "Building Storybook..."
npm run build-storybook

# Then run Chromatic
Write-Host "Running Chromatic with token..."
npx chromatic --project-token=$env:CHROMATIC_PROJECT_TOKEN --storybook-build-dir=storybook-static --exit-zero-on-changes --allow-console-errors

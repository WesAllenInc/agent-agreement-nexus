# Direct Chromatic execution script
# Replace YOUR_PROJECT_TOKEN with your actual token from the Chromatic website

$token = "chpt_29d9d3f461ad26f"

Write-Host "Running Chromatic directly with provided token..."
npx chromatic --project-token=$token --storybook-build-dir=storybook-static --exit-zero-on-changes --allow-console-errors

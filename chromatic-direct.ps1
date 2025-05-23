# Direct Chromatic execution script
# Uses the chromatic.config.json file for configuration

$token = "chpt_29d9d3f461ad26f"

Write-Host "Running Chromatic directly with provided token..."
npx chromatic --project-token=$token

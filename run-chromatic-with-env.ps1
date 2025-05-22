# PowerShell script to run Chromatic with token from .env.local
# This script loads the CHROMATIC_PROJECT_TOKEN from .env.local

# Load environment variables from .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $key = $matches[1]
            $value = $matches[2]
            Set-Item -Path "env:$key" -Value $value
        }
    }
    Write-Host "Loaded environment variables from $envFile"
} else {
    Write-Host "Error: $envFile not found"
    exit 1
}

# Verify token is loaded
if (-not $env:CHROMATIC_PROJECT_TOKEN) {
    Write-Host "Error: CHROMATIC_PROJECT_TOKEN not found in $envFile"
    exit 1
}

Write-Host "Running Chromatic with token from .env.local..."
npx chromatic --storybook-build-dir=storybook-static --exit-zero-on-changes --allow-console-errors --skip-storybook-build

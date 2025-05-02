#!/bin/bash

# This script handles deployment to Vercel
# It receives environment variables from the GitHub workflow

# Check if we're in a production deployment
if [ "$GITHUB_EVENT_NAME" == "push" ]; then
  echo "Deploying to production..."
  npx vercel deploy --prod --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" --yes
else
  echo "Deploying preview..."
  npx vercel deploy --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" --yes
fi

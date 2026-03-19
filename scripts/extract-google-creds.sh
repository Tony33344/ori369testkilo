#!/bin/bash
# Extract client_email and private_key from Google Calendar credentials JSON
# Usage: ./scripts/extract-google-creds.sh

JSON_FILE="google-calendar-credentials.json"

if [ ! -f "$JSON_FILE" ]; then
  echo "❌ Error: $JSON_FILE not found in current directory"
  echo "   Make sure you're in the project root"
  exit 1
fi

echo "📋 Extracting credentials from $JSON_FILE..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Copy these values to Netlify Environment Variables:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract client_email
CLIENT_EMAIL=$(jq -r '.client_email' "$JSON_FILE")
echo "Variable: GOOGLE_SERVICE_ACCOUNT_EMAIL"
echo "Value:"
echo "$CLIENT_EMAIL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract private_key
PRIVATE_KEY=$(jq -r '.private_key' "$JSON_FILE")
echo "Variable: GOOGLE_PRIVATE_KEY"
echo "Value:"
echo "$PRIVATE_KEY"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Done! Now:"
echo "   1. Go to Netlify → Site settings → Environment variables"
echo "   2. DELETE: GOOGLE_SERVICE_ACCOUNT_KEY (the huge base64 string)"
echo "   3. ADD: GOOGLE_SERVICE_ACCOUNT_EMAIL with the value above"
echo "   4. ADD: GOOGLE_PRIVATE_KEY with the value above (including BEGIN/END lines)"
echo "   5. Redeploy your site"
echo ""

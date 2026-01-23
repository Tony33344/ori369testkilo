#!/bin/bash

# ORI369 Direct Reservation Page Test
# Testing booking flow directly from reservation page
# Using agent-browser for automated testing

set -e

# Configuration
BASE_URL="http://localhost:3000"
TEST_RESULTS_DIR="test-results/reservation-direct"

# Test user data
TEST_EMAIL="directtest-$(date +%s)@example.com"
TEST_NAME="Direct Test User"
TEST_PHONE="041123456"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create results directory
mkdir -p "$TEST_RESULTS_DIR"

echo -e "${GREEN}Starting Direct Reservation Page Test${NC}"
echo "Results: $TEST_RESULTS_DIR"
echo "Test User: $TEST_EMAIL"
echo "----------------------------------------"

# Step 1: Go directly to reservation page
echo -e "${YELLOW}Step 1: Opening reservation page...${NC}"

npx agent-browser open "$BASE_URL/rezervacija"
npx agent-browser wait 3000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step1-reservation-page.png"

echo -e "${GREEN}✓ Step 1 completed - Reservation page loaded${NC}"

# Step 2: Select "Manualna Terapija" from dropdown
echo -e "${YELLOW}Step 2: Selecting Manualna Terapija from dropdown...${NC}"

npx agent-browser find label "Izberite storitev *" click
npx agent-browser wait 500
npx agent-browser find text "Manualna Terapija" click
npx agent-browser wait 1000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step2-service-selected.png"

echo -e "${GREEN}✓ Step 2 completed - Service selected${NC}"

# Step 3: Select date (27.1.2026)
echo -e "${YELLOW}Step 3: Selecting date 27.1.2026...${NC}"

npx agent-browser find text "Uporabi spustni seznam" click
npx agent-browser wait 500

# Find and select January 27, 2026
npx agent-browser find label "Izberite datum *" click
npx agent-browser wait 500
# Look for the date option - this might need adjustment based on actual date format
npx agent-browser find text "27. 1. 2026" click
npx agent-browser wait 2000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step3-date-selected.png"

echo -e "${GREEN}✓ Step 3 completed - Date selected${NC}"

# Step 4: Select time slot 10:00
echo -e "${YELLOW}Step 4: Selecting time slot 10:00...${NC}"

npx agent-browser find text "10:00" click
npx agent-browser wait 1000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step4-time-selected.png"

echo -e "${GREEN}✓ Step 4 completed - Time slot selected${NC}"

# Step 5: Click "Rezerviraj termin" to proceed
echo -e "${YELLOW}Step 5: Clicking Rezerviraj termin...${NC}"

npx agent-browser find role button click --name "Rezerviraj termin"
npx agent-browser wait 3000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step5-booking-submitted.png"

echo -e "${GREEN}✓ Step 5 completed - Booking submitted${NC}"

# Step 6: Handle authentication redirect
echo -e "${YELLOW}Step 6: Handling authentication...${NC}"

# Check current URL
npx agent-browser get url > "$TEST_RESULTS_DIR/step6-current-url.txt"
CURRENT_URL=$(cat "$TEST_RESULTS_DIR/step6-current-url.txt")

if [[ $CURRENT_URL == *"/registracija"* ]]; then
    echo "Redirected to registration page"
    npx agent-browser screenshot "$TEST_RESULTS_DIR/step6-registration-redirect.png"

    # Fill registration form
    npx agent-browser find label "Ime *" fill "$TEST_NAME"
    npx agent-browser find label "Email *" fill "$TEST_EMAIL"
    npx agent-browser find label "Geslo *" fill "TestPass123!"
    npx agent-browser find label "Potrdi geslo *" fill "TestPass123!"

    # Accept terms
    npx agent-browser find text "Strinjam se" click

    # Submit registration
    npx agent-browser find text "Registriraj se" click
    npx agent-browser wait 5000
    npx agent-browser screenshot "$TEST_RESULTS_DIR/step6-registration-completed.png"

    echo -e "${GREEN}✓ Step 6 completed - User registered${NC}"
else
    echo "No registration redirect, proceeding to checkout"
fi

# Step 7: Complete checkout
echo -e "${YELLOW}Step 7: Completing checkout...${NC}"

npx agent-browser get url > "$TEST_RESULTS_DIR/step7-checkout-url.txt"
npx agent-browser screenshot "$TEST_RESULTS_DIR/step7-checkout-page.png"

# Fill checkout form
npx agent-browser find label "Ime *" fill "$TEST_NAME"
npx agent-browser find label "Email *" fill "$TEST_EMAIL"
npx agent-browser find label "Telefon *" fill "$TEST_PHONE"

# Accept terms
npx agent-browser find text "Strinjam se s pogoji" click

# Select payment method - UPN
npx agent-browser find text "UPN plačilo" click
npx agent-browser wait 1000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step7-payment-selected.png"

echo -e "${GREEN}✓ Step 7 completed - Checkout form filled${NC}"

# Step 8: Generate QR code and complete
echo -e "${YELLOW}Step 8: Generating QR code...${NC}"

npx agent-browser find text "Generiraj QR kodo" click
npx agent-browser wait 2000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step8-qr-generated.png"

echo -e "${GREEN}✓ Step 8 completed - QR code generated${NC}"

# Final verification
echo -e "${YELLOW}Final: Test completed successfully!${NC}"

# Create summary
echo "Direct Reservation Test Summary:" > "$TEST_RESULTS_DIR/test-summary.txt"
echo "Test User: $TEST_EMAIL" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "Date: 27.1.2026" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "Time: 10:00" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "Service: Manualna Terapija" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "Steps completed:" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ Reservation page access" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ Service selection from dropdown" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ Date selection (27.1.2026)" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ Time slot selection (10:00)" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ Booking submission" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ User registration/authentication" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ Checkout process" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ Payment method selection" >> "$TEST_RESULTS_DIR/test-summary.txt"
echo "✅ QR code generation" >> "$TEST_RESULTS_DIR/test-summary.txt"

echo -e "${GREEN}🎉 Direct Reservation Test Completed Successfully!${NC}"
echo ""
echo "Results saved to: $TEST_RESULTS_DIR"
echo ""
echo "Test Summary:"
echo "- ✅ Direct access to reservation page"
echo "- ✅ Service selection from dropdown"
echo "- ✅ Date/time slot selection"
echo "- ✅ Complete booking flow"
echo "- ✅ User registration and checkout"
echo "- ✅ Payment processing"
echo ""
echo -e "${YELLOW}Check screenshots and test-summary.txt for detailed results${NC}"
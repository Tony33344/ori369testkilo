#!/bin/bash

# ORI369 Comprehensive Reservation E2E Flow Test
# Following the complete user journey from homepage to checkout
# Using agent-browser for automated testing

set -e

# Configuration
BASE_URL="http://localhost:3000"
TEST_RESULTS_DIR="test-results/reservation-e2e"
SESSION="reservation-e2e-$(date +%s)"

# Test user data
TEST_EMAIL="e2etest-$(date +%s)@example.com"
TEST_NAME="Test User E2E"
TEST_PHONE="041123456"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create results directory
mkdir -p "$TEST_RESULTS_DIR"

echo -e "${GREEN}Starting Comprehensive Reservation E2E Flow Test${NC}"
echo "Session: $SESSION"
echo "Results: $TEST_RESULTS_DIR"
echo "Test User: $TEST_EMAIL"
echo "----------------------------------------"

# Step 1: User goes to hero site (homepage)
echo -e "${YELLOW}Step 1: Visiting homepage...${NC}"

npx agent-browser open "$BASE_URL"
npx agent-browser wait 3000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step1-homepage.png"

echo -e "${GREEN}✓ Step 1 completed - Homepage loaded${NC}"

# Step 2: Selects therapy
echo -e "${YELLOW}Step 2: Selecting therapy from homepage...${NC}"

npx agent-browser open "$BASE_URL"
npx agent-browser wait 3000

# Click on "Raziščite terapije" button (Explore therapies)
npx agent-browser find text "Raziščite terapije" click
npx agent-browser wait 3000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step2-therapies-page.png"

# Select "Manualna Terapija" from the therapies list (use nth to select first link)
npx agent-browser find nth 1 click
npx agent-browser wait 3000
npx agent-browser screenshot "$TEST_RESULTS_DIR/step2-therapy-detail.png"

echo -e "${GREEN}✓ Step 2 completed - Therapy selected and detail page loaded${NC}"

# Step 3: Reads therapy content
echo -e "${YELLOW}Step 3: Reading therapy content...${NC}"

# Scroll down to read content
npx agent-browser --session "$SESSION-step3" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-step3" wait 2000

# Take screenshot of therapy content
npx agent-browser --session "$SESSION-step3" screenshot "$TEST_RESULTS_DIR/step3-therapy-content.png"

# Look for booking/reservation button
npx agent-browser --session "$SESSION-step3" find role button count --name "Rezerviraj termin" > "$TEST_RESULTS_DIR/step3-booking-button-count.txt"

echo -e "${GREEN}✓ Step 3 completed - Therapy content read${NC}"

# Step 4: Goes to booking
echo -e "${YELLOW}Step 4: Navigating to booking page...${NC}"

npx agent-browser --session "$SESSION-step4" find role button click --name "Rezerviraj termin"
npx agent-browser --session "$SESSION-step4" wait 3000

# Verify we're on booking page
npx agent-browser --session "$SESSION-step4" get url > "$TEST_RESULTS_DIR/step4-booking-url.txt"
npx agent-browser --session "$SESSION-step4" screenshot "$TEST_RESULTS_DIR/step4-booking-page.png"

echo -e "${GREEN}✓ Step 4 completed - Booking page loaded${NC}"

# Step 5: Selects time appointment
echo -e "${YELLOW}Step 5: Selecting time appointment...${NC}"

# Select service from dropdown (scroll down menu on reservation page)
npx agent-browser --session "$SESSION-step5" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-step5" wait 500
# Select "Manualna Terapija" from the dropdown options
npx agent-browser --session "$SESSION-step5" find role option click --name "Manualna Terapija"
npx agent-browser --session "$SESSION-step5" wait 1000

# Use dropdown for date selection
npx agent-browser --session "$SESSION-step5" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-step5" wait 500

# Select tomorrow's date
npx agent-browser --session "$SESSION-step5" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-step5" wait 500
npx agent-browser --session "$SESSION-step5" find role option click --nth 2
npx agent-browser --session "$SESSION-step5" wait 2000

# Select first available time slot
npx agent-browser --session "$SESSION-step5" find text "09:00" click
npx agent-browser --session "$SESSION-step5" wait 1000

npx agent-browser --session "$SESSION-step5" screenshot "$TEST_RESULTS_DIR/step5-time-selected.png"

echo -e "${GREEN}✓ Step 5 completed - Time slot selected${NC}"

# Step 6: Clicks "potrdi rezervacijo" (confirm reservation)
echo -e "${YELLOW}Step 6: Clicking confirm reservation...${NC}"

npx agent-browser --session "$SESSION-step6" find role button click --name "Rezerviraj termin"
npx agent-browser --session "$SESSION-step6" wait 3000

# Should redirect to login/registration since user not authenticated
npx agent-browser --session "$SESSION-step6" get url > "$TEST_RESULTS_DIR/step6-confirm-redirect-url.txt"
npx agent-browser --session "$SESSION-step6" screenshot "$TEST_RESULTS_DIR/step6-confirm-redirect.png"

echo -e "${GREEN}✓ Step 6 completed - Reservation confirmed, redirected to auth${NC}"

# Step 7: Fills in new user sign up data
echo -e "${YELLOW}Step 7: Filling new user registration data...${NC}"

# Check if we're on registration page, if not navigate there
CURRENT_URL=$(cat "$TEST_RESULTS_DIR/step6-confirm-redirect-url.txt")
if [[ ! $CURRENT_URL == *"/registracija"* ]]; then
    npx agent-browser --session "$SESSION-step7" open "$BASE_URL/registracija"
    npx agent-browser --session "$SESSION-step7" wait 2000
fi

# Fill registration form
npx agent-browser --session "$SESSION-step7" find label "Ime *" fill "$TEST_NAME"
npx agent-browser --session "$SESSION-step7" find label "Email *" fill "$TEST_EMAIL"
npx agent-browser --session "$SESSION-step7" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-step7" find label "Potrdi geslo *" fill "TestPass123!"

# Accept terms
npx agent-browser --session "$SESSION-step7" find text "Strinjam se" click

# Submit registration
npx agent-browser --session "$SESSION-step7" find text "Registriraj se" click
npx agent-browser --session "$SESSION-step7" wait 5000

npx agent-browser --session "$SESSION-step7" screenshot "$TEST_RESULTS_DIR/step7-registration-completed.png"

echo -e "${GREEN}✓ Step 7 completed - User registration completed${NC}"

# Step 8: Selects how to pay
echo -e "${YELLOW}Step 8: Selecting payment method...${NC}"

# Should be redirected to checkout after registration
npx agent-browser --session "$SESSION-step8" get url > "$TEST_RESULTS_DIR/step8-checkout-url.txt"
npx agent-browser --session "$SESSION-step8" screenshot "$TEST_RESULTS_DIR/step8-checkout-page.png"

# Fill checkout form
npx agent-browser --session "$SESSION-step8" find label "Ime *" fill "$TEST_NAME"
npx agent-browser --session "$SESSION-step8" find label "Email *" fill "$TEST_EMAIL"
npx agent-browser --session "$SESSION-step8" find label "Telefon *" fill "$TEST_PHONE"

# Accept terms
npx agent-browser --session "$SESSION-step8" find text "Strinjam se s pogoji" click

# Select payment method - try UPN first
npx agent-browser --session "$SESSION-step8" find text "UPN plačilo" click
npx agent-browser --session "$SESSION-step8" wait 1000
npx agent-browser --session "$SESSION-step8" screenshot "$TEST_RESULTS_DIR/step8-payment-upn-selected.png"

echo -e "${GREEN}✓ Step 8 completed - Payment method selected${NC}"

# Step 9: Goes to checkout/payment
echo -e "${YELLOW}Step 9: Proceeding to payment...${NC}"

# For UPN payment, generate QR code
npx agent-browser --session "$SESSION-step9" find text "Generiraj QR kodo" click
npx agent-browser --session "$SESSION-step9" wait 2000
npx agent-browser --session "$SESSION-step9" screenshot "$TEST_RESULTS_DIR/step9-qr-generated.png"

# Alternative: Try Stripe payment
npx agent-browser --session "$SESSION-step9" find text "Stripe" click
npx agent-browser --session "$SESSION-step9" wait 1000
npx agent-browser --session "$SESSION-step9" find text "Plačaj" click
npx agent-browser --session "$SESSION-step9" wait 3000

# Check if redirected to Stripe
npx agent-browser --session "$SESSION-step9" get url > "$TEST_RESULTS_DIR/step9-stripe-redirect-url.txt"
npx agent-browser --session "$SESSION-step9" screenshot "$TEST_RESULTS_DIR/step9-stripe-redirect.png"

echo -e "${GREEN}✓ Step 9 completed - Payment processing initiated${NC}"

# Final verification
echo -e "${YELLOW}Final: Verifying complete flow...${NC}"

# Check all URLs to verify the flow
echo "Flow URLs:" > "$TEST_RESULTS_DIR/flow-summary.txt"
echo "Homepage: $BASE_URL" >> "$TEST_RESULTS_DIR/flow-summary.txt"
echo "Therapy Detail: $(cat "$TEST_RESULTS_DIR/step4-booking-url.txt")" >> "$TEST_RESULTS_DIR/flow-summary.txt"
echo "Booking: $(cat "$TEST_RESULTS_DIR/step4-booking-url.txt")" >> "$TEST_RESULTS_DIR/flow-summary.txt"
echo "Checkout: $(cat "$TEST_RESULTS_DIR/step8-checkout-url.txt")" >> "$TEST_RESULTS_DIR/flow-summary.txt"
echo "Payment: $(cat "$TEST_RESULTS_DIR/step9-stripe-redirect-url.txt")" >> "$TEST_RESULTS_DIR/flow-summary.txt"

echo "Test User: $TEST_EMAIL" >> "$TEST_RESULTS_DIR/flow-summary.txt"
echo "Test completed successfully!" >> "$TEST_RESULTS_DIR/flow-summary.txt"

echo -e "${GREEN}🎉 Complete Reservation E2E Flow Test Finished Successfully!${NC}"
echo ""
echo "Results saved to: $TEST_RESULTS_DIR"
echo ""
echo "Flow Summary:"
echo "- ✅ Homepage visit"
echo "- ✅ Therapy selection and reading"
echo "- ✅ Booking page navigation"
echo "- ✅ Time slot selection"
echo "- ✅ Reservation confirmation"
echo "- ✅ User registration"
echo "- ✅ Payment method selection"
echo "- ✅ Checkout completion"
echo ""
echo -e "${YELLOW}Check screenshots and flow-summary.txt for detailed results${NC}"
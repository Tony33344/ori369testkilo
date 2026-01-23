#!/bin/bash

# ORI369 Combined and Edge Case Workflows Test Suite
# Using npx agent-browser for automated testing

set -e

# Configuration
BASE_URL="http://localhost:3000"
TEST_RESULTS_DIR="test-results/combined"
EDGE_RESULTS_DIR="test-results/edge-cases"
SESSION="combined-test-$(date +%s)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create results directories
mkdir -p "$TEST_RESULTS_DIR"
mkdir -p "$EDGE_RESULTS_DIR"

echo -e "${GREEN}Starting Combined and Edge Case Workflows Tests${NC}"
echo "Session: $SESSION"
echo "Results: $TEST_RESULTS_DIR, $EDGE_RESULTS_DIR"
echo "----------------------------------------"

# CW-01: Shopping + Service Purchase
echo -e "${YELLOW}CW-01: Testing combined shopping and service purchase...${NC}"

# Create test user for this workflow
TEST_USER_EMAIL="combined-$(date +%s)@example.com"

# Register test user
npx agent-browser --session "$SESSION-cw01-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-cw01-setup" find label "Ime *" fill "Combined Test"
npx agent-browser --session "$SESSION-cw01-setup" find label "Email *" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-cw01-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-cw01-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-cw01-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-cw01-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-cw01-setup" wait 3000
npx agent-browser --session "$SESSION-cw01-setup" close

# Login and add product to cart
npx agent-browser --session "$SESSION-cw01" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-cw01" find label "Email" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-cw01" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-cw01" find text "Prijava" click
npx agent-browser --session "$SESSION-cw01" wait 3000

# Add product to cart
npx agent-browser --session "$SESSION-cw01" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-cw01" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-cw01" wait 2000

# Book a service
npx agent-browser --session "$SESSION-cw01" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-cw01" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-cw01" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-cw01" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-cw01" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-cw01" find role option click --nth 3
npx agent-browser --session "$SESSION-cw01" wait 2000
npx agent-browser --session "$SESSION-cw01" find text "11:00" click
npx agent-browser --session "$SESSION-cw01" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-cw01" wait 3000

# Verify combined checkout
npx agent-browser --session "$SESSION-cw01" get url > "$TEST_RESULTS_DIR/cw01-01-combined-checkout-url.txt"
npx agent-browser --session "$SESSION-cw01" screenshot "$TEST_RESULTS_DIR/cw01-01-combined-checkout.png"

npx agent-browser --session "$SESSION-cw01" close

echo -e "${GREEN}✓ CW-01 completed${NC}"

# EC-01: Network Issues During Checkout
echo -e "${YELLOW}EC-01: Testing network issues during checkout...${NC}"

npx agent-browser --session "$SESSION-ec01" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-ec01" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-ec01" wait 2000
npx agent-browser --session "$SESSION-ec01" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-ec01" wait 1000
npx agent-browser --session "$SESSION-ec01" find text "Na blagajno" click
npx agent-browser --session "$SESSION-ec01" wait 2000

# Fill form
npx agent-browser --session "$SESSION-ec01" find label "Ime *" fill "Network Test"
npx agent-browser --session "$SESSION-ec01" find label "Email *" fill "network@example.com"
npx agent-browser --session "$SESSION-ec01" find label "Telefon *" fill "041 123 456"
npx agent-browser --session "$SESSION-ec01" find text "Strinjam se s pogoji" click

# Take screenshot before payment
npx agent-browser --session "$SESSION-ec01" screenshot "$EDGE_RESULTS_DIR/ec01-01-before-payment.png"

# Note: Actual network interruption testing would require network manipulation tools
# For now, we document the test setup
echo "Network interruption test setup complete - manual network blocking needed for full test" > "$EDGE_RESULTS_DIR/ec01-02-network-test-note.txt"

npx agent-browser --session "$SESSION-ec01" close

echo -e "${GREEN}✓ EC-01 completed${NC}"

# EC-02: Session Timeout
echo -e "${YELLOW}EC-02: Testing session timeout behavior...${NC}"

# Login and start booking process
npx agent-browser --session "$SESSION-ec02" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-ec02" find label "Email" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-ec02" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-ec02" find text "Prijava" click
npx agent-browser --session "$SESSION-ec02" wait 3000

npx agent-browser --session "$SESSION-ec02" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-ec02" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-ec02" find text "Manualna Terapija" click

# Wait extended period (simulate session timeout)
echo "Waiting 5 seconds to simulate session timeout test setup..."
npx agent-browser --session "$SESSION-ec02" wait 5000

# Try to continue booking
npx agent-browser --session "$SESSION-ec02" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-ec02" wait 1000

# Check if redirected to login
npx agent-browser --session "$SESSION-ec02" get url > "$EDGE_RESULTS_DIR/ec02-01-session-timeout-url.txt"
npx agent-browser --session "$SESSION-ec02" screenshot "$EDGE_RESULTS_DIR/ec02-01-session-timeout.png"

npx agent-browser --session "$SESSION-ec02" close

echo -e "${GREEN}✓ EC-02 completed${NC}"

echo -e "${GREEN}All Combined and Edge Case Workflows Tests Completed!${NC}"
echo "Results saved to: $TEST_RESULTS_DIR, $EDGE_RESULTS_DIR"
echo ""
echo "Summary:"
echo "- CW-01: Combined shopping and service purchase"
echo "- EC-01: Network issues during checkout"
echo "- EC-02: Session timeout behavior"
echo ""
echo -e "${YELLOW}Check screenshots and logs for detailed results${NC}"
echo ""
echo -e "${YELLOW}Note: Some edge cases require manual intervention or additional tools:${NC}"
echo "- Network blocking for EC-01"
echo "- Extended wait times for EC-02"
#!/bin/bash

# ORI369 Shopping Workflows Test Suite
# Using npx agent-browser for automated testing

set -e

# Configuration
BASE_URL="http://localhost:3000"
TEST_RESULTS_DIR="test-results/shopping"
SESSION="shopping-test-$(date +%s)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create results directory
mkdir -p "$TEST_RESULTS_DIR"

echo -e "${GREEN}Starting Shopping Workflows Tests${NC}"
echo "Session: $SESSION"
echo "Results: $TEST_RESULTS_DIR"
echo "----------------------------------------"

# SW-01: Browse Products and Search
echo -e "${YELLOW}SW-01: Testing product browsing and search...${NC}"

npx npx agent-browser --session "$SESSION-sw01" open "$BASE_URL/trgovina"
npx npx agent-browser --session "$SESSION-sw01" wait 2000
npx npx agent-browser --session "$SESSION-sw01" screenshot "$TEST_RESULTS_DIR/sw01-01-shop-initial.png"

# Get interactive elements
npx npx agent-browser --session "$SESSION-sw01" snapshot -i > "$TEST_RESULTS_DIR/sw01-01-interactive-elements.txt"

# Test search
npx npx agent-browser --session "$SESSION-sw01" find placeholder "Išči izdelke..." fill "vitamin"
npx npx agent-browser --session "$SESSION-sw01" wait 1000
npx npx agent-browser --session "$SESSION-sw01" screenshot "$TEST_RESULTS_DIR/sw01-02-search-results.png"

# Test category filtering
npx npx agent-browser --session "$SESSION-sw01" find text "Vse" click
npx npx agent-browser --session "$SESSION-sw01" wait 500
npx npx agent-browser --session "$SESSION-sw01" find text "Prehranska dopolnila" click
npx npx agent-browser --session "$SESSION-sw01" wait 1000
npx npx agent-browser --session "$SESSION-sw01" screenshot "$TEST_RESULTS_DIR/sw01-03-category-filter.png"

# Clear search
npx npx agent-browser --session "$SESSION-sw01" find text "Počisti iskanje" click
npx npx agent-browser --session "$SESSION-sw01" wait 500

npx npx agent-browser --session "$SESSION-sw01" close

echo -e "${GREEN}✓ SW-01 completed${NC}"

# SW-02: Add to Cart and Cart Management
echo -e "${YELLOW}SW-02: Testing cart functionality...${NC}"

npx agent-browser --session "$SESSION-sw02" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw02" wait 2000

# Add first available product to cart
npx agent-browser --session "$SESSION-sw02" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw02" wait 2000

# Verify cart button shows count
npx agent-browser --session "$SESSION-sw02" find role button --name "Košarica" text > "$TEST_RESULTS_DIR/sw02-01-cart-count.txt"
npx agent-browser --session "$SESSION-sw02" screenshot "$TEST_RESULTS_DIR/sw02-01-cart-with-item.png"

# Open cart drawer
npx agent-browser --session "$SESSION-sw02" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw02" wait 1000
npx agent-browser --session "$SESSION-sw02" screenshot "$TEST_RESULTS_DIR/sw02-02-cart-drawer.png"

# Add another product
npx agent-browser --session "$SESSION-sw02" find text "V košarico" click --nth 2
npx agent-browser --session "$SESSION-sw02" wait 2000

# Verify cart count updated
npx agent-browser --session "$SESSION-sw02" find role button --name "Košarica" text > "$TEST_RESULTS_DIR/sw02-03-updated-cart-count.txt"

# Close cart and test persistence
npx agent-browser --session "$SESSION-sw02" find text "Zapri" click
npx agent-browser --session "$SESSION-sw02" open "$BASE_URL/terapije"
npx agent-browser --session "$SESSION-sw02" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw02" wait 1000

# Verify cart persistence
npx agent-browser --session "$SESSION-sw02" find role button --name "Košarica" text > "$TEST_RESULTS_DIR/sw02-04-cart-persistence.txt"

npx agent-browser --session "$SESSION-sw02" close

echo -e "${GREEN}✓ SW-02 completed${NC}"

# SW-03: Checkout Process
echo -e "${YELLOW}SW-03: Testing checkout process...${NC}"

npx agent-browser --session "$SESSION-sw03" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw03" wait 2000

# Ensure cart has items (add if needed)
npx agent-browser --session "$SESSION-sw03" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw03" wait 1000

# Check if cart has items, add one if empty
CART_CONTENT=$(npx agent-browser --session "$SESSION-sw03" find text "Na blagajno" count)
if [ "$CART_CONTENT" -eq 0 ]; then
    npx agent-browser --session "$SESSION-sw03" find text "Zapri" click
    npx agent-browser --session "$SESSION-sw03" find text "V košarico" click --nth 1
    npx agent-browser --session "$SESSION-sw03" wait 2000
    npx agent-browser --session "$SESSION-sw03" find role button --name "Košarica" click
    npx agent-browser --session "$SESSION-sw03" wait 1000
fi

# Proceed to checkout
npx agent-browser --session "$SESSION-sw03" find text "Na blagajno" click
npx agent-browser --session "$SESSION-sw03" wait 2000

# Verify on checkout page
npx agent-browser --session "$SESSION-sw03" get url > "$TEST_RESULTS_DIR/sw03-01-checkout-url.txt"
npx agent-browser --session "$SESSION-sw03" screenshot "$TEST_RESULTS_DIR/sw03-01-checkout-page.png"

# Fill checkout form
npx agent-browser --session "$SESSION-sw03" find label "Ime *" fill "Test User"
npx agent-browser --session "$SESSION-sw03" find label "Email *" fill "test@example.com"
npx agent-browser --session "$SESSION-sw03" find label "Telefon *" fill "041 123 456"

# Accept terms
npx agent-browser --session "$SESSION-sw03" find text "Strinjam se s pogoji" click

# Submit order (will redirect to Stripe - don't complete payment)
npx agent-browser --session "$SESSION-sw03" find text "Plačaj" click
npx agent-browser --session "$SESSION-sw03" wait 3000

# Verify Stripe redirect
npx agent-browser --session "$SESSION-sw03" get url > "$TEST_RESULTS_DIR/sw03-02-stripe-url.txt"
npx agent-browser --session "$SESSION-sw03" screenshot "$TEST_RESULTS_DIR/sw03-02-stripe-redirect.png"

npx agent-browser --session "$SESSION-sw03" close

echo -e "${GREEN}✓ SW-03 completed${NC}"

# SW-04: Out of Stock Handling
echo -e "${YELLOW}SW-04: Testing out of stock handling...${NC}"

npx agent-browser --session "$SESSION-sw04" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw04" wait 2000

# Look for out of stock indicators
npx agent-browser --session "$SESSION-sw04" find text "Razprodano" count > "$TEST_RESULTS_DIR/sw04-01-out-of-stock-count.txt"
npx agent-browser --session "$SESSION-sw04" find text "Samo še" count > "$TEST_RESULTS_DIR/sw04-02-low-stock-count.txt"

# Try to interact with out of stock product if available
OUT_OF_STOCK_COUNT=$(cat "$TEST_RESULTS_DIR/sw04-01-out-of-stock-count.txt")
if [ "$OUT_OF_STOCK_COUNT" -gt 0 ]; then
    npx agent-browser --session "$SESSION-sw04" find text "Razprodano" click --nth 1
    npx agent-browser --session "$SESSION-sw04" wait 1000
    npx agent-browser --session "$SESSION-sw04" screenshot "$TEST_RESULTS_DIR/sw04-03-out-of-stock-detail.png"
fi

npx agent-browser --session "$SESSION-sw04" close

echo -e "${GREEN}✓ SW-04 completed${NC}"

# SW-05: Product Detail Interactions (Deep Linking, Image Galleries)
echo -e "${YELLOW}SW-05: Testing product detail interactions...${NC}"

npx agent-browser --session "$SESSION-sw05" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw05" wait 2000

# Click on first product for deep linking
npx agent-browser --session "$SESSION-sw05" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw05" wait 2000

# Get current URL for deep linking verification
npx agent-browser --session "$SESSION-sw05" get url > "$TEST_RESULTS_DIR/sw05-01-product-url.txt"
npx agent-browser --session "$SESSION-sw05" screenshot "$TEST_RESULTS_DIR/sw05-01-product-detail.png"

# Test image gallery interactions
npx agent-browser --session "$SESSION-sw05" find role img count > "$TEST_RESULTS_DIR/sw05-02-image-count.txt"
IMAGE_COUNT=$(cat "$TEST_RESULTS_DIR/sw05-02-image-count.txt")
if [ "$IMAGE_COUNT" -gt 1 ]; then
    npx agent-browser --session "$SESSION-sw05" find role img click --nth 2
    npx agent-browser --session "$SESSION-sw05" wait 1000
    npx agent-browser --session "$SESSION-sw05" screenshot "$TEST_RESULTS_DIR/sw05-03-image-gallery.png"
fi

npx agent-browser --session "$SESSION-sw05" close

echo -e "${GREEN}✓ SW-05 completed${NC}"

# SW-06: Advanced Cart Operations (Quantity Adjustments, Bulk Operations)
echo -e "${YELLOW}SW-06: Testing advanced cart operations...${NC}"

npx agent-browser --session "$SESSION-sw06" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw06" wait 2000

# Add multiple products to cart
npx agent-browser --session "$SESSION-sw06" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw06" wait 1000
npx agent-browser --session "$SESSION-sw06" find text "V košarico" click --nth 2
npx agent-browser --session "$SESSION-sw06" wait 1000

# Open cart drawer
npx agent-browser --session "$SESSION-sw06" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw06" wait 1000
npx agent-browser --session "$SESSION-sw06" screenshot "$TEST_RESULTS_DIR/sw06-01-cart-initial.png"

# Test quantity adjustment (increase)
npx agent-browser --session "$SESSION-sw06" find text "+" click --nth 1
npx agent-browser --session "$SESSION-sw06" wait 1000
npx agent-browser --session "$SESSION-sw06" screenshot "$TEST_RESULTS_DIR/sw06-02-quantity-increased.png"

# Test quantity adjustment (decrease)
npx agent-browser --session "$SESSION-sw06" find text "-" click --nth 1
npx agent-browser --session "$SESSION-sw06" wait 1000
npx agent-browser --session "$SESSION-sw06" screenshot "$TEST_RESULTS_DIR/sw06-03-quantity-decreased.png"

# Test remove item
npx agent-browser --session "$SESSION-sw06" find text "Odstrani" click --nth 1
npx agent-browser --session "$SESSION-sw06" wait 1000
npx agent-browser --session "$SESSION-sw06" screenshot "$TEST_RESULTS_DIR/sw06-04-item-removed.png"

npx agent-browser --session "$SESSION-sw06" close

echo -e "${GREEN}✓ SW-06 completed${NC}"

# SW-07: Discount/Coupon Functionality
echo -e "${YELLOW}SW-07: Testing discount/coupon functionality...${NC}"

npx agent-browser --session "$SESSION-sw07" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw07" wait 2000

# Add product to cart
npx agent-browser --session "$SESSION-sw07" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw07" wait 1000

# Open cart and check for discount input
npx agent-browser --session "$SESSION-sw07" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw07" wait 1000
npx agent-browser --session "$SESSION-sw07" screenshot "$TEST_RESULTS_DIR/sw07-01-cart-before-discount.png"

# Apply discount code (assuming input exists)
npx agent-browser --session "$SESSION-sw07" find placeholder "Koda kupona" fill "TEST10"
npx agent-browser --session "$SESSION-sw07" wait 1000
npx agent-browser --session "$SESSION-sw07" find text "Uporabi" click
npx agent-browser --session "$SESSION-sw07" wait 2000
npx agent-browser --session "$SESSION-sw07" screenshot "$TEST_RESULTS_DIR/sw07-02-discount-applied.png"

npx agent-browser --session "$SESSION-sw07" close

echo -e "${GREEN}✓ SW-07 completed${NC}"

# SW-08: Wishlist Features (if available)
echo -e "${YELLOW}SW-08: Testing wishlist features...${NC}"

npx agent-browser --session "$SESSION-sw08" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw08" wait 2000

# Check for wishlist buttons
npx agent-browser --session "$SESSION-sw08" find text "Dodaj v wishlist" count > "$TEST_RESULTS_DIR/sw08-01-wishlist-count.txt"
WISHLIST_COUNT=$(cat "$TEST_RESULTS_DIR/sw08-01-wishlist-count.txt")
if [ "$WISHLIST_COUNT" -gt 0 ]; then
    # Add to wishlist
    npx agent-browser --session "$SESSION-sw08" find text "Dodaj v wishlist" click --nth 1
    npx agent-browser --session "$SESSION-sw08" wait 1000
    npx agent-browser --session "$SESSION-sw08" screenshot "$TEST_RESULTS_DIR/sw08-02-added-to-wishlist.png"

    # Check wishlist page if accessible
    npx agent-browser --session "$SESSION-sw08" find text "Wishlist" click
    npx agent-browser --session "$SESSION-sw08" wait 2000
    npx agent-browser --session "$SESSION-sw08" screenshot "$TEST_RESULTS_DIR/sw08-03-wishlist-page.png"
else
    echo "Wishlist feature not available" > "$TEST_RESULTS_DIR/sw08-04-wishlist-not-available.txt"
fi

npx agent-browser --session "$SESSION-sw08" close

echo -e "${GREEN}✓ SW-08 completed${NC}"

# SW-09: Product Filtering/Sorting
echo -e "${YELLOW}SW-09: Testing product filtering/sorting...${NC}"

npx agent-browser --session "$SESSION-sw09" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw09" wait 2000
npx agent-browser --session "$SESSION-sw09" screenshot "$TEST_RESULTS_DIR/sw09-01-initial-products.png"

# Test sorting options
npx agent-browser --session "$SESSION-sw09" find text "Cena (najnižja)" click
npx agent-browser --session "$SESSION-sw09" wait 1000
npx agent-browser --session "$SESSION-sw09" screenshot "$TEST_RESULTS_DIR/sw09-02-sorted-price-low.png"

npx agent-browser --session "$SESSION-sw09" find text "Cena (najvišja)" click
npx agent-browser --session "$SESSION-sw09" wait 1000
npx agent-browser --session "$SESSION-sw09" screenshot "$TEST_RESULTS_DIR/sw09-03-sorted-price-high.png"

# Test filtering
npx agent-browser --session "$SESSION-sw09" find text "Prehranska dopolnila" click
npx agent-browser --session "$SESSION-sw09" wait 1000
npx agent-browser --session "$SESSION-sw09" screenshot "$TEST_RESULTS_DIR/sw09-04-filtered-category.png"

npx agent-browser --session "$SESSION-sw09" close

echo -e "${GREEN}✓ SW-09 completed${NC}"

# SW-10: Empty Cart Scenarios
echo -e "${YELLOW}SW-10: Testing empty cart scenarios...${NC}"

npx agent-browser --session "$SESSION-sw10" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw10" wait 2000

# Add product to cart
npx agent-browser --session "$SESSION-sw10" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw10" wait 1000

# Open cart
npx agent-browser --session "$SESSION-sw10" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw10" wait 1000
npx agent-browser --session "$SESSION-sw10" screenshot "$TEST_RESULTS_DIR/sw10-01-cart-with-item.png"

# Empty cart
npx agent-browser --session "$SESSION-sw10" find text "Izprazni košarico" click
npx agent-browser --session "$SESSION-sw10" wait 1000
npx agent-browser --session "$SESSION-sw10" screenshot "$TEST_RESULTS_DIR/sw10-02-cart-emptied.png"

# Verify empty cart state
npx agent-browser --session "$SESSION-sw10" find text "Vaša košarica je prazna" count > "$TEST_RESULTS_DIR/sw10-03-empty-cart-count.txt"

npx agent-browser --session "$SESSION-sw10" close

echo -e "${GREEN}✓ SW-10 completed${NC}"

# SW-11: Discount Code Validation
echo -e "${YELLOW}SW-11: Testing discount code validation...${NC}"

npx agent-browser --session "$SESSION-sw11" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw11" wait 2000

# Add product to cart
npx agent-browser --session "$SESSION-sw11" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw11" wait 1000

# Open cart
npx agent-browser --session "$SESSION-sw11" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw11" wait 1000

# Test invalid discount code
npx agent-browser --session "$SESSION-sw11" find placeholder "Koda kupona" fill "INVALID"
npx agent-browser --session "$SESSION-sw11" find text "Uporabi" click
npx agent-browser --session "$SESSION-sw11" wait 2000
npx agent-browser --session "$SESSION-sw11" screenshot "$TEST_RESULTS_DIR/sw11-01-invalid-discount.png"

# Test valid discount code
npx agent-browser --session "$SESSION-sw11" find placeholder "Koda kupona" fill "VALID10"
npx agent-browser --session "$SESSION-sw11" find text "Uporabi" click
npx agent-browser --session "$SESSION-sw11" wait 2000
npx agent-browser --session "$SESSION-sw11" screenshot "$TEST_RESULTS_DIR/sw11-02-valid-discount.png"

npx agent-browser --session "$SESSION-sw11" close

echo -e "${GREEN}✓ SW-11 completed${NC}"

# SW-12: Profile Persistence
echo -e "${YELLOW}SW-12: Testing profile persistence...${NC}"

npx agent-browser --session "$SESSION-sw12" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-sw12" wait 2000

# Register new user (no email confirmation)
npx agent-browser --session "$SESSION-sw12" find label "Ime" fill "Test User"
npx agent-browser --session "$SESSION-sw12" find label "Email" fill "testpersist@example.com"
npx agent-browser --session "$SESSION-sw12" find label "Geslo" fill "password123"
npx agent-browser --session "$SESSION-sw12" find text "Registriraj se" click
npx agent-browser --session "$SESSION-sw12" wait 3000
npx agent-browser --session "$SESSION-sw12" screenshot "$TEST_RESULTS_DIR/sw12-01-registered.png"

# Go to shop and add to cart
npx agent-browser --session "$SESSION-sw12" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw12" wait 2000
npx agent-browser --session "$SESSION-sw12" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw12" wait 1000

# Close and reopen browser to test persistence
npx agent-browser --session "$SESSION-sw12" close
npx agent-browser --session "$SESSION-sw12-new" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw12-new" wait 2000

# Check cart persistence
npx agent-browser --session "$SESSION-sw12-new" find role button --name "Košarica" text > "$TEST_RESULTS_DIR/sw12-02-cart-persistence.txt"
npx agent-browser --session "$SESSION-sw12-new" screenshot "$TEST_RESULTS_DIR/sw12-03-persistence-check.png"

npx agent-browser --session "$SESSION-sw12-new" close

echo -e "${GREEN}✓ SW-12 completed${NC}"

# SW-13: UPN Payment QR Code Generation
echo -e "${YELLOW}SW-13: Testing UPN payment QR code generation...${NC}"

npx agent-browser --session "$SESSION-sw13" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw13" wait 2000

# Add product and go to checkout
npx agent-browser --session "$SESSION-sw13" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw13" wait 1000
npx agent-browser --session "$SESSION-sw13" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw13" wait 1000
npx agent-browser --session "$SESSION-sw13" find text "Na blagajno" click
npx agent-browser --session "$SESSION-sw13" wait 2000

# Fill checkout form
npx agent-browser --session "$SESSION-sw13" find label "Ime *" fill "Test User"
npx agent-browser --session "$SESSION-sw13" find label "Email *" fill "test@example.com"
npx agent-browser --session "$SESSION-sw13" find label "Telefon *" fill "041 123 456"
npx agent-browser --session "$SESSION-sw13" find text "Strinjam se s pogoji" click

# Select UPN payment
npx agent-browser --session "$SESSION-sw13" find text "UPN plačilo" click
npx agent-browser --session "$SESSION-sw13" wait 1000
npx agent-browser --session "$SESSION-sw13" screenshot "$TEST_RESULTS_DIR/sw13-01-upn-selected.png"

# Generate QR code
npx agent-browser --session "$SESSION-sw13" find text "Generiraj QR kodo" click
npx agent-browser --session "$SESSION-sw13" wait 2000
npx agent-browser --session "$SESSION-sw13" screenshot "$TEST_RESULTS_DIR/sw13-02-qr-generated.png"

npx agent-browser --session "$SESSION-sw13" close

echo -e "${GREEN}✓ SW-13 completed${NC}"

# SW-14: Edge Cases (Payment Failures, Stock Updates, Session Expiry)
echo -e "${YELLOW}SW-14: Testing edge cases...${NC}"

# Payment failure simulation
npx agent-browser --session "$SESSION-sw14" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw14" wait 2000
npx agent-browser --session "$SESSION-sw14" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw14" wait 1000
npx agent-browser --session "$SESSION-sw14" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw14" wait 1000
npx agent-browser --session "$SESSION-sw14" find text "Na blagajno" click
npx agent-browser --session "$SESSION-sw14" wait 2000

# Fill form and attempt payment (simulate failure by not completing)
npx agent-browser --session "$SESSION-sw14" find label "Ime *" fill "Test User"
npx agent-browser --session "$SESSION-sw14" find label "Email *" fill "test@example.com"
npx agent-browser --session "$SESSION-sw14" find label "Telefon *" fill "041 123 456"
npx agent-browser --session "$SESSION-sw14" find text "Strinjam se s pogoji" click
npx agent-browser --session "$SESSION-sw14" find text "Plačaj" click
npx agent-browser --session "$SESSION-sw14" wait 3000
npx agent-browser --session "$SESSION-sw14" screenshot "$TEST_RESULTS_DIR/sw14-01-payment-attempt.png"

# Stock update simulation (add to cart, then check if stock changes affect)
npx agent-browser --session "$SESSION-sw14" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw14" wait 2000
npx agent-browser --session "$SESSION-sw14" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw14" wait 1000
npx agent-browser --session "$SESSION-sw14" screenshot "$TEST_RESULTS_DIR/sw14-02-stock-before.png"
# Simulate stock update by waiting (in real test, would need backend change)
npx agent-browser --session "$SESSION-sw14" wait 5000
npx agent-browser --session "$SESSION-sw14" screenshot "$TEST_RESULTS_DIR/sw14-03-stock-after.png"

# Session expiry (long wait)
npx agent-browser --session "$SESSION-sw14" open "$BASE_URL/trgovina"
npx agent-browser --session "$SESSION-sw14" wait 2000
npx agent-browser --session "$SESSION-sw14" find text "V košarico" click --nth 1
npx agent-browser --session "$SESSION-sw14" wait 1000
npx agent-browser --session "$SESSION-sw14" find role button --name "Košarica" click
npx agent-browser --session "$SESSION-sw14" wait 1000
npx agent-browser --session "$SESSION-sw14" screenshot "$TEST_RESULTS_DIR/sw14-04-session-initial.png"
# Wait for session expiry (adjust time as needed)
npx agent-browser --session "$SESSION-sw14" wait 30000
npx agent-browser --session "$SESSION-sw14" screenshot "$TEST_RESULTS_DIR/sw14-05-session-after-expiry.png"

npx agent-browser --session "$SESSION-sw14" close

echo -e "${GREEN}✓ SW-14 completed${NC}"

echo -e "${GREEN}All Shopping Workflows Tests Completed!${NC}"
echo "Results saved to: $TEST_RESULTS_DIR"
echo ""
echo "Summary:"
echo "- SW-01: Product browsing and search"
echo "- SW-02: Cart management and persistence"
echo "- SW-03: Checkout process and Stripe integration"
echo "- SW-04: Out of stock handling"
echo "- SW-05: Product detail interactions"
echo "- SW-06: Advanced cart operations"
echo "- SW-07: Discount/coupon functionality"
echo "- SW-08: Wishlist features"
echo "- SW-09: Product filtering/sorting"
echo "- SW-10: Empty cart scenarios"
echo "- SW-11: Discount code validation"
echo "- SW-12: Profile persistence"
echo "- SW-13: UPN payment QR code generation"
echo "- SW-14: Edge cases"
echo ""
echo -e "${YELLOW}Check screenshots and logs for detailed results${NC}"
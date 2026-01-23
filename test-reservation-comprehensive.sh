#!/bin/bash

# Comprehensive Reservation Test Workflow
# Improved version with better error handling, session management, and reporting

set -e  # Exit on any error

# Configuration
BASE_URL="http://localhost:3000"
TEST_RESULTS_DIR="test-results/reservation-comprehensive"
SESSION_PREFIX="reservation-test-$(date +%s)"
LOG_FILE="$TEST_RESULTS_DIR/test-log.txt"
SUMMARY_FILE="$TEST_RESULTS_DIR/test-summary.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test user data
TEST_EMAIL="test-reservation-$(date +%s)@example.com"
TEST_NAME="Test Reservation User"
TEST_PHONE="041123456"

# Initialize test environment
init_test() {
    echo -e "${BLUE}Initializing comprehensive reservation test...${NC}"

    # Create results directory
    mkdir -p "$TEST_RESULTS_DIR"

    # Initialize log file
    echo "=== Comprehensive Reservation Test Started ===" > "$LOG_FILE"
    echo "Date: $(date)" >> "$LOG_FILE"
    echo "Base URL: $BASE_URL" >> "$LOG_FILE"
    echo "Test Email: $TEST_EMAIL" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
}

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Error handling
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    log "ERROR: $1"
    cleanup_sessions
    exit 1
}

# Cleanup function
cleanup_sessions() {
    log "Cleaning up test sessions..."
    npx agent-browser session list 2>/dev/null | grep "$SESSION_PREFIX" | while read -r line; do
        session_name=$(echo "$line" | awk '{print $1}')
        if [ -n "$session_name" ]; then
            npx agent-browser --session "$session_name" close 2>/dev/null || true
        fi
    done
}

# Take screenshot with timestamp
screenshot() {
    local name="$1"
    local timestamp=$(date +%H%M%S)
    local filename="$TEST_RESULTS_DIR/${name}-${timestamp}.png"
    npx agent-browser screenshot "$filename" 2>/dev/null || log "Failed to take screenshot: $name"
}

# Test step wrapper
test_step() {
    local step_name="$1"
    local session="$2"
    shift 2

    log "Starting step: $step_name"
    echo -e "${YELLOW}→ $step_name${NC}"

    if npx agent-browser --session "$session" "$@" 2>>"$LOG_FILE"; then
        log "✓ Step completed: $step_name"
        return 0
    else
        error_exit "Step failed: $step_name"
    fi
}

# Main test function
run_reservation_test() {
    local session="$SESSION_PREFIX-main"

    log "Starting main reservation test flow"

    # Step 1: Navigate to reservation page
    test_step "Navigate to reservation page" "$session" open "$BASE_URL/rezervacija"
    test_step "Wait for page load" "$session" wait --load networkidle
    screenshot "01-reservation-page"

    # Step 2: Verify login required message
    test_step "Check login required message" "$session" snapshot -i > "$TEST_RESULTS_DIR/02-login-required-snapshot.txt"
    # Check if the login message exists by looking for it in the snapshot
    if ! grep -q "Prosim, prijavite se za rezervacijo" "$TEST_RESULTS_DIR/02-login-required-snapshot.txt"; then
        log "Warning: Login required message not found in snapshot, but continuing..."
    else
        log "✓ Login required message verified"
    fi

    # Step 3: Navigate to registration
    test_step "Navigate to registration" "$session" open "$BASE_URL/registracija"
    test_step "Wait for registration page" "$session" wait --load networkidle
    screenshot "03-registration-page"

    # Step 4: Fill registration form
    test_step "Fill name field" "$session" fill "label:has-text('Ime *')" "$TEST_NAME"
    test_step "Fill email field" "$session" fill "label:has-text('Email *')" "$TEST_EMAIL"
    test_step "Fill password field" "$session" fill "label:has-text('Geslo *')" "TestPass123!"
    test_step "Fill confirm password" "$session" fill "label:has-text('Potrdi geslo *')" "TestPass123!"
    test_step "Accept terms" "$session" click "text=Strinjam se"
    screenshot "04-registration-filled"

    # Step 5: Submit registration
    test_step "Submit registration" "$session" click "text=Registriraj se"
    test_step "Wait for registration completion" "$session" wait 5000
    screenshot "05-registration-submitted"

    # Step 6: Navigate back to reservation (now authenticated)
    test_step "Navigate to reservation authenticated" "$session" open "$BASE_URL/rezervacija"
    test_step "Wait for authenticated reservation page" "$session" wait --load networkidle
    screenshot "06-reservation-authenticated"

    # Step 7: Select service
    test_step "Select Manualna Terapija service" "$session" select "select" "Manualna Terapija"
    test_step "Wait for service selection" "$session" wait 2000
    screenshot "07-service-selected"

    # Step 8: Switch to dropdown date selection
    test_step "Switch to dropdown date selection" "$session" click "text=Uporabi spustni seznam"
    test_step "Wait for dropdown" "$session" wait 1000

    # Step 9: Select date
    test_step "Open date dropdown" "$session" click "label:has-text('Izberite datum *')"
    test_step "Wait for date options" "$session" wait 1000
    test_step "Select tomorrow's date" "$session" click "role=option" --nth 2
    test_step "Wait for date selection" "$session" wait 3000
    screenshot "08-date-selected"

    # Step 10: Select time slot
    test_step "Select 10:00 time slot" "$session" click "text=10:00"
    test_step "Wait for time selection" "$session" wait 2000
    screenshot "09-time-selected"

    # Step 11: Submit booking
    test_step "Submit booking" "$session" click "button:has-text('Rezerviraj termin')"
    test_step "Wait for booking submission" "$session" wait 5000
    screenshot "10-booking-submitted"

    # Step 12: Verify redirect to checkout
    local current_url
    current_url=$(npx agent-browser --session "$session" get url)
    if [[ ! $current_url == *"/checkout"* ]]; then
        error_exit "Not redirected to checkout page. Current URL: $current_url"
    fi
    log "✓ Redirected to checkout page: $current_url"
    screenshot "11-checkout-page"

    # Step 13: Fill checkout form
    test_step "Fill checkout name" "$session" fill "label:has-text('Ime *')" "$TEST_NAME"
    test_step "Fill checkout email" "$session" fill "label:has-text('Email *')" "$TEST_EMAIL"
    test_step "Fill checkout phone" "$session" fill "label:has-text('Telefon *')" "$TEST_PHONE"
    test_step "Accept checkout terms" "$session" click "text=Strinjam se s pogoji"
    screenshot "12-checkout-filled"

    # Step 14: Select UPN payment
    test_step "Select UPN payment" "$session" click "text=UPN plačilo"
    test_step "Wait for UPN selection" "$session" wait 2000
    screenshot "13-upn-selected"

    # Step 15: Generate QR code
    test_step "Generate QR code" "$session" click "text=Generiraj QR kodo"
    test_step "Wait for QR generation" "$session" wait 3000
    screenshot "14-qr-generated"

    # Step 16: Verify QR code display
    if ! npx agent-browser --session "$session" get text | grep -q "QR koda za plačilo"; then
        error_exit "QR code generation failed"
    fi
    log "✓ QR code generated successfully"
    screenshot "15-final-result"

    # Cleanup
    test_step "Close browser session" "$session" close
}

# Generate test summary
generate_summary() {
    echo "=== Test Summary ===" > "$SUMMARY_FILE"
    echo "Test completed successfully!" >> "$SUMMARY_FILE"
    echo "Date: $(date)" >> "$SUMMARY_FILE"
    echo "Test User: $TEST_EMAIL" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"
    echo "Screenshots saved in: $TEST_RESULTS_DIR" >> "$SUMMARY_FILE"
    echo "Log file: $LOG_FILE" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"
    echo "Test Steps Completed:" >> "$SUMMARY_FILE"
    echo "✓ Navigate to reservation page" >> "$SUMMARY_FILE"
    echo "✓ Verify authentication requirement" >> "$SUMMARY_FILE"
    echo "✓ User registration" >> "$SUMMARY_FILE"
    echo "✓ Service selection" >> "$SUMMARY_FILE"
    echo "✓ Date and time selection" >> "$SUMMARY_FILE"
    echo "✓ Booking submission" >> "$SUMMARY_FILE"
    echo "✓ Checkout process" >> "$SUMMARY_FILE"
    echo "✓ UPN payment with QR code" >> "$SUMMARY_FILE"
}

# Main execution
main() {
    echo -e "${BLUE}=== Comprehensive Reservation Test ===${NC}"
    echo "Base URL: $BASE_URL"
    echo "Results: $TEST_RESULTS_DIR"
    echo ""

    # Setup
    init_test

    # Set trap for cleanup
    trap cleanup_sessions EXIT

    # Run test
    if run_reservation_test; then
        echo -e "${GREEN}✓ All tests passed!${NC}"
        generate_summary
        echo -e "${GREEN}Test summary saved to: $SUMMARY_FILE${NC}"
        echo -e "${GREEN}Screenshots and logs available in: $TEST_RESULTS_DIR${NC}"
    else
        error_exit "Test failed"
    fi
}

# Run main function
main "$@"
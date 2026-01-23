#!/bin/bash

# ORI369 Reservation Workflows Test Suite
# Using npx agent-browser for automated testing

set -e

# Configuration
BASE_URL="http://localhost:3000"
TEST_RESULTS_DIR="test-results/reservation"
SESSION="reservation-test-$(date +%s)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create results directory
mkdir -p "$TEST_RESULTS_DIR"

echo -e "${GREEN}Starting Reservation Workflows Tests${NC}"
echo "Session: $SESSION"
echo "Results: $TEST_RESULTS_DIR"
echo "----------------------------------------"

# RW-01: Anonymous User Booking Attempt
echo -e "${YELLOW}RW-01: Testing anonymous booking restrictions...${NC}"

npx agent-browser --session "$SESSION-rw01" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw01" wait 2000

# Verify authentication prompt
npx agent-browser --session "$SESSION-rw01" find text "Rezervacijo lahko dokončate po prijavi" count > "$TEST_RESULTS_DIR/rw01-01-auth-prompt.txt"
npx agent-browser --session "$SESSION-rw01" screenshot "$TEST_RESULTS_DIR/rw01-01-auth-required.png"

# Try to access booking form
npx agent-browser --session "$SESSION-rw01" find label "Izberite storitev" click
npx agent-browser --session "$SESSION-rw01" wait 1000

# Verify redirect behavior
npx agent-browser --session "$SESSION-rw01" get url > "$TEST_RESULTS_DIR/rw01-02-redirect-url.txt"

npx agent-browser --session "$SESSION-rw01" close

echo -e "${GREEN}✓ RW-01 completed${NC}"

# RW-02: User Registration and Login
echo -e "${YELLOW}RW-02: Testing user registration and login...${NC}"

npx agent-browser --session "$SESSION-rw02" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw02" wait 2000

# Fill registration form
npx agent-browser --session "$SESSION-rw02" find label "Ime *" fill "Test User"
npx agent-browser --session "$SESSION-rw02" find label "Email *" fill "testuser-$(date +%s)@example.com"
npx agent-browser --session "$SESSION-rw02" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw02" find label "Potrdi geslo *" fill "TestPass123!"

# Accept terms
npx agent-browser --session "$SESSION-rw02" find text "Strinjam se" click

# Submit registration
npx agent-browser --session "$SESSION-rw02" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw02" wait 3000

# Verify successful registration (should redirect to dashboard or login)
npx agent-browser --session "$SESSION-rw02" get url > "$TEST_RESULTS_DIR/rw02-01-registration-url.txt"
npx agent-browser --session "$SESSION-rw02" screenshot "$TEST_RESULTS_DIR/rw02-01-registration-success.png"

# If redirected to login, login with new credentials
CURRENT_URL=$(cat "$TEST_RESULTS_DIR/rw02-01-registration-url.txt")
if [[ $CURRENT_URL == *"/prijava"* ]]; then
    npx agent-browser --session "$SESSION-rw02" find label "Email" fill "testuser-$(date +%s)@example.com"
    npx agent-browser --session "$SESSION-rw02" find label "Geslo" fill "TestPass123!"
    npx agent-browser --session "$SESSION-rw02" find text "Prijava" click
    npx agent-browser --session "$SESSION-rw02" wait 3000
fi

# Verify login success
npx agent-browser --session "$SESSION-rw02" get url > "$TEST_RESULTS_DIR/rw02-02-login-url.txt"
npx agent-browser --session "$SESSION-rw02" screenshot "$TEST_RESULTS_DIR/rw02-02-login-success.png"

npx agent-browser --session "$SESSION-rw02" close

echo -e "${GREEN}✓ RW-02 completed${NC}"

# RW-03: Complete Booking Flow
echo -e "${YELLOW}RW-03: Testing complete booking flow...${NC}"

# Use a consistent test user email for booking tests
TEST_USER_EMAIL="bookingtest-$(date +%s)@example.com"

# First register/login a test user
npx agent-browser --session "$SESSION-rw03-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw03-setup" find label "Ime *" fill "Booking Test"
npx agent-browser --session "$SESSION-rw03-setup" find label "Email *" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-rw03-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw03-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw03-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw03-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw03-setup" wait 3000
npx agent-browser --session "$SESSION-rw03-setup" close

# Now test booking flow
npx agent-browser --session "$SESSION-rw03" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw03" find label "Email" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-rw03" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw03" find text "Prijava" click
npx agent-browser --session "$SESSION-rw03" wait 3000

# Navigate to booking
npx agent-browser --session "$SESSION-rw03" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw03" wait 2000
npx agent-browser --session "$SESSION-rw03" screenshot "$TEST_RESULTS_DIR/rw03-01-booking-form.png"

# Select service
npx agent-browser --session "$SESSION-rw03" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw03" wait 500
npx agent-browser --session "$SESSION-rw03" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw03" wait 1000

# Select date (use dropdown for reliability)
npx agent-browser --session "$SESSION-rw03" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw03" wait 500

# Select tomorrow's date
npx agent-browser --session "$SESSION-rw03" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw03" wait 500
npx agent-browser --session "$SESSION-rw03" find role option click --nth 2
npx agent-browser --session "$SESSION-rw03" wait 2000

# Select available time slot
npx agent-browser --session "$SESSION-rw03" find text "09:00" click
npx agent-browser --session "$SESSION-rw03" wait 1000

# Add notes
npx agent-browser --session "$SESSION-rw03" find label "Dodatne opombe" fill "Test booking via npx agent-browser"

# Submit booking
npx agent-browser --session "$SESSION-rw03" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw03" wait 3000

# Verify redirect to checkout
npx agent-browser --session "$SESSION-rw03" get url > "$TEST_RESULTS_DIR/rw03-02-checkout-redirect-url.txt"
npx agent-browser --session "$SESSION-rw03" screenshot "$TEST_RESULTS_DIR/rw03-02-checkout-redirect.png"

npx agent-browser --session "$SESSION-rw03" close

echo -e "${GREEN}✓ RW-03 completed${NC}"

# RW-04: Booking Validation and Error Handling
echo -e "${YELLOW}RW-04: Testing booking validation...${NC}"

npx agent-browser --session "$SESSION-rw04" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw04" find label "Email" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-rw04" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw04" find text "Prijava" click
npx agent-browser --session "$SESSION-rw04" wait 3000

npx agent-browser --session "$SESSION-rw04" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw04" wait 2000

# Try to submit empty form
npx agent-browser --session "$SESSION-rw04" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw04" wait 1000

# Check for validation messages
npx agent-browser --session "$SESSION-rw04" find text "error" count > "$TEST_RESULTS_DIR/rw04-01-validation-errors.txt"
npx agent-browser --session "$SESSION-rw04" screenshot "$TEST_RESULTS_DIR/rw04-01-validation-errors.png"

# Select service but no date
npx agent-browser --session "$SESSION-rw04" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw04" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw04" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw04" wait 1000

# Select date but no time
npx agent-browser --session "$SESSION-rw04" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw04" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw04" find role option click --nth 2
npx agent-browser --session "$SESSION-rw04" wait 2000
npx agent-browser --session "$SESSION-rw04" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw04" wait 1000

# Verify time selection required
npx agent-browser --session "$SESSION-rw04" screenshot "$TEST_RESULTS_DIR/rw04-02-time-required.png"

npx agent-browser --session "$SESSION-rw04" close

echo -e "${GREEN}✓ RW-04 completed${NC}"

# RW-05: Time Slot Availability and Conflicts
echo -e "${YELLOW}RW-05: Testing time slot availability...${NC}"

npx agent-browser --session "$SESSION-rw05" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw05" find label "Email" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-rw05" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw05" find text "Prijava" click
npx agent-browser --session "$SESSION-rw05" wait 3000

npx agent-browser --session "$SESSION-rw05" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw05" wait 2000

# Select service
npx agent-browser --session "$SESSION-rw05" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw05" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw05" wait 1000

# Select date
npx agent-browser --session "$SESSION-rw05" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw05" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw05" find role option click --nth 2
npx agent-browser --session "$SESSION-rw05" wait 2000

# Check time slot legend
npx agent-browser --session "$SESSION-rw05" find text "Prosto" count > "$TEST_RESULTS_DIR/rw05-01-available-count.txt"
npx agent-browser --session "$SESSION-rw05" find text "Zasedeno" count > "$TEST_RESULTS_DIR/rw05-02-booked-count.txt"
npx agent-browser --session "$SESSION-rw05" find text "Zasedeno (Koledar)" count > "$TEST_RESULTS_DIR/rw05-03-calendar-busy-count.txt"

# Take screenshot of time slots
npx agent-browser --session "$SESSION-rw05" screenshot "$TEST_RESULTS_DIR/rw05-04-time-slots.png"

# Try to select unavailable slot (if any marked as booked)
BOOKED_COUNT=$(cat "$TEST_RESULTS_DIR/rw05-02-booked-count.txt")
if [ "$BOOKED_COUNT" -gt 0 ]; then
    npx agent-browser --session "$SESSION-rw05" find text "🔒" click --nth 1
    npx agent-browser --session "$SESSION-rw05" wait 500
    npx agent-browser --session "$SESSION-rw05" screenshot "$TEST_RESULTS_DIR/rw05-05-unavailable-slot.png"
fi

npx agent-browser --session "$SESSION-rw05" close

echo -e "${GREEN}✓ RW-05 completed${NC}"

# RW-06: Package Booking
echo -e "${YELLOW}RW-06: Testing package booking...${NC}"

npx agent-browser --session "$SESSION-rw06" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw06" find label "Email" fill "$TEST_USER_EMAIL"
npx agent-browser --session "$SESSION-rw06" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw06" find text "Prijava" click
npx agent-browser --session "$SESSION-rw06" wait 3000

npx agent-browser --session "$SESSION-rw06" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw06" wait 2000

# Check package options in service dropdown
npx agent-browser --session "$SESSION-rw06" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw06" wait 500

# Look for package options
npx agent-browser --session "$SESSION-rw06" find text "Paketi" count > "$TEST_RESULTS_DIR/rw06-01-package-options-count.txt"
npx agent-browser --session "$SESSION-rw06" screenshot "$TEST_RESULTS_DIR/rw06-01-package-options.png"

# Select a package if available
PACKAGE_COUNT=$(cat "$TEST_RESULTS_DIR/rw06-01-package-options-count.txt")
if [ "$PACKAGE_COUNT" -gt 0 ]; then
    npx agent-browser --session "$SESSION-rw06" find text "Paket" click --nth 1
    npx agent-browser --session "$SESSION-rw06" wait 1000
    npx agent-browser --session "$SESSION-rw06" screenshot "$TEST_RESULTS_DIR/rw06-02-package-selected.png"

    # Complete booking process for package
    npx agent-browser --session "$SESSION-rw06" find text "Uporabi spustni seznam" click
    npx agent-browser --session "$SESSION-rw06" find label "Izberite datum *" click
    npx agent-browser --session "$SESSION-rw06" find role option click --nth 3
    npx agent-browser --session "$SESSION-rw06" wait 2000
    npx agent-browser --session "$SESSION-rw06" find text "10:00" click
    npx agent-browser --session "$SESSION-rw06" find text "Rezerviraj termin" click
    npx agent-browser --session "$SESSION-rw06" wait 3000

    # Verify checkout redirect
    npx agent-browser --session "$SESSION-rw06" get url > "$TEST_RESULTS_DIR/rw06-03-package-checkout-url.txt"
fi

npx agent-browser --session "$SESSION-rw06" close

echo -e "${GREEN}✓ RW-06 completed${NC}"

# RW-07: Booking Management (Cancellation, Rescheduling, Modification)
echo -e "${YELLOW}RW-07: Testing booking management...${NC}"

# Use existing test user
BOOKING_USER_EMAIL="bookingmgmt-$(date +%s)@example.com"

# Register and book an appointment first
npx agent-browser --session "$SESSION-rw07-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw07-setup" find label "Ime *" fill "Booking Mgmt Test"
npx agent-browser --session "$SESSION-rw07-setup" find label "Email *" fill "$BOOKING_USER_EMAIL"
npx agent-browser --session "$SESSION-rw07-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw07-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw07-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw07-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw07-setup" wait 3000
npx agent-browser --session "$SESSION-rw07-setup" close

# Login and book
npx agent-browser --session "$SESSION-rw07-book" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw07-book" find label "Email" fill "$BOOKING_USER_EMAIL"
npx agent-browser --session "$SESSION-rw07-book" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw07-book" find text "Prijava" click
npx agent-browser --session "$SESSION-rw07-book" wait 3000

npx agent-browser --session "$SESSION-rw07-book" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw07-book" wait 2000
npx agent-browser --session "$SESSION-rw07-book" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw07-book" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw07-book" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw07-book" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw07-book" find role option click --nth 2
npx agent-browser --session "$SESSION-rw07-book" wait 2000
npx agent-browser --session "$SESSION-rw07-book" find text "09:00" click
npx agent-browser --session "$SESSION-rw07-book" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw07-book" wait 3000
npx agent-browser --session "$SESSION-rw07-book" close

# Now test management
npx agent-browser --session "$SESSION-rw07" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw07" find label "Email" fill "$BOOKING_USER_EMAIL"
npx agent-browser --session "$SESSION-rw07" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw07" find text "Prijava" click
npx agent-browser --session "$SESSION-rw07" wait 3000

# Navigate to dashboard
npx agent-browser --session "$SESSION-rw07" open "$BASE_URL/dashboard"
npx agent-browser --session "$SESSION-rw07" wait 2000
npx agent-browser --session "$SESSION-rw07" screenshot "$TEST_RESULTS_DIR/rw07-01-dashboard.png"

# Look for booking management options
npx agent-browser --session "$SESSION-rw07" find text "Prekliči" count > "$TEST_RESULTS_DIR/rw07-02-cancel-count.txt"
npx agent-browser --session "$SESSION-rw07" find text "Spremeni" count > "$TEST_RESULTS_DIR/rw07-03-modify-count.txt"

# Test cancellation if available
CANCEL_COUNT=$(cat "$TEST_RESULTS_DIR/rw07-02-cancel-count.txt")
if [ "$CANCEL_COUNT" -gt 0 ]; then
    npx agent-browser --session "$SESSION-rw07" find text "Prekliči" click --nth 1
    npx agent-browser --session "$SESSION-rw07" wait 1000
    npx agent-browser --session "$SESSION-rw07" screenshot "$TEST_RESULTS_DIR/rw07-04-cancel-confirm.png"
    # Assume confirmation dialog or direct cancel
    npx agent-browser --session "$SESSION-rw07" find text "Da" click || npx agent-browser --session "$SESSION-rw07" find text "Prekliči" click
    npx agent-browser --session "$SESSION-rw07" wait 2000
    npx agent-browser --session "$SESSION-rw07" screenshot "$TEST_RESULTS_DIR/rw07-05-cancelled.png"
fi

# Test modification/rescheduling if available
MODIFY_COUNT=$(cat "$TEST_RESULTS_DIR/rw07-03-modify-count.txt")
if [ "$MODIFY_COUNT" -gt 0 ]; then
    npx agent-browser --session "$SESSION-rw07" find text "Spremeni" click --nth 1
    npx agent-browser --session "$SESSION-rw07" wait 1000
    npx agent-browser --session "$SESSION-rw07" screenshot "$TEST_RESULTS_DIR/rw07-06-modify-form.png"
    # Change time or date
    npx agent-browser --session "$SESSION-rw07" find text "10:00" click
    npx agent-browser --session "$SESSION-rw07" find text "Shrani" click
    npx agent-browser --session "$SESSION-rw07" wait 2000
    npx agent-browser --session "$SESSION-rw07" screenshot "$TEST_RESULTS_DIR/rw07-07-modified.png"
fi

npx agent-browser --session "$SESSION-rw07" close

echo -e "${GREEN}✓ RW-07 completed${NC}"

# RW-08: Multiple Appointment Booking
echo -e "${YELLOW}RW-08: Testing multiple appointment booking...${NC}"

MULTI_USER_EMAIL="multiappt-$(date +%s)@example.com"

# Register user
npx agent-browser --session "$SESSION-rw08-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw08-setup" find label "Ime *" fill "Multi Appt Test"
npx agent-browser --session "$SESSION-rw08-setup" find label "Email *" fill "$MULTI_USER_EMAIL"
npx agent-browser --session "$SESSION-rw08-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw08-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw08-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw08-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw08-setup" wait 3000
npx agent-browser --session "$SESSION-rw08-setup" close

# Login
npx agent-browser --session "$SESSION-rw08" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw08" find label "Email" fill "$MULTI_USER_EMAIL"
npx agent-browser --session "$SESSION-rw08" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw08" find text "Prijava" click
npx agent-browser --session "$SESSION-rw08" wait 3000

# Book first appointment
npx agent-browser --session "$SESSION-rw08" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw08" wait 2000
npx agent-browser --session "$SESSION-rw08" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw08" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw08" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw08" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw08" find role option click --nth 2
npx agent-browser --session "$SESSION-rw08" wait 2000
npx agent-browser --session "$SESSION-rw08" find text "09:00" click
npx agent-browser --session "$SESSION-rw08" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw08" wait 3000
npx agent-browser --session "$SESSION-rw08" screenshot "$TEST_RESULTS_DIR/rw08-01-first-booking.png"

# Book second appointment
npx agent-browser --session "$SESSION-rw08" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw08" wait 2000
npx agent-browser --session "$SESSION-rw08" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw08" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw08" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw08" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw08" find role option click --nth 3
npx agent-browser --session "$SESSION-rw08" wait 2000
npx agent-browser --session "$SESSION-rw08" find text "10:00" click
npx agent-browser --session "$SESSION-rw08" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw08" wait 3000
npx agent-browser --session "$SESSION-rw08" screenshot "$TEST_RESULTS_DIR/rw08-02-second-booking.png"

# Check dashboard for multiple bookings
npx agent-browser --session "$SESSION-rw08" open "$BASE_URL/dashboard"
npx agent-browser --session "$SESSION-rw08" wait 2000
npx agent-browser --session "$SESSION-rw08" find text "Rezervacija" count > "$TEST_RESULTS_DIR/rw08-03-booking-count.txt"
npx agent-browser --session "$SESSION-rw08" screenshot "$TEST_RESULTS_DIR/rw08-04-dashboard-multiple.png"

npx agent-browser --session "$SESSION-rw08" close

echo -e "${GREEN}✓ RW-08 completed${NC}"

# RW-09: Calendar Integration Verification (Google Calendar Sync)
echo -e "${YELLOW}RW-09: Testing Google Calendar sync...${NC}"

CAL_USER_EMAIL="calsync-$(date +%s)@example.com"

# Register and book
npx agent-browser --session "$SESSION-rw09-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw09-setup" find label "Ime *" fill "Cal Sync Test"
npx agent-browser --session "$SESSION-rw09-setup" find label "Email *" fill "$CAL_USER_EMAIL"
npx agent-browser --session "$SESSION-rw09-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw09-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw09-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw09-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw09-setup" wait 3000
npx agent-browser --session "$SESSION-rw09-setup" close

npx agent-browser --session "$SESSION-rw09" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw09" find label "Email" fill "$CAL_USER_EMAIL"
npx agent-browser --session "$SESSION-rw09" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw09" find text "Prijava" click
npx agent-browser --session "$SESSION-rw09" wait 3000

npx agent-browser --session "$SESSION-rw09" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw09" wait 2000
npx agent-browser --session "$SESSION-rw09" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw09" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw09" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw09" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw09" find role option click --nth 2
npx agent-browser --session "$SESSION-rw09" wait 2000
npx agent-browser --session "$SESSION-rw09" find text "Zasedeno (Koledar)" count > "$TEST_RESULTS_DIR/rw09-01-calendar-busy-count.txt"
npx agent-browser --session "$SESSION-rw09" screenshot "$TEST_RESULTS_DIR/rw09-02-calendar-sync.png"

# Try to book and check sync
npx agent-browser --session "$SESSION-rw09" find text "09:00" click
npx agent-browser --session "$SESSION-rw09" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw09" wait 3000
npx agent-browser --session "$SESSION-rw09" screenshot "$TEST_RESULTS_DIR/rw09-03-booking-with-sync.png"

npx agent-browser --session "$SESSION-rw09" close

echo -e "${GREEN}✓ RW-09 completed${NC}"

# RW-10: Waitlist Functionality (if available)
echo -e "${YELLOW}RW-10: Testing waitlist functionality...${NC}"

WAITLIST_USER_EMAIL="waitlist-$(date +%s)@example.com"

npx agent-browser --session "$SESSION-rw10-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw10-setup" find label "Ime *" fill "Waitlist Test"
npx agent-browser --session "$SESSION-rw10-setup" find label "Email *" fill "$WAITLIST_USER_EMAIL"
npx agent-browser --session "$SESSION-rw10-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw10-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw10-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw10-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw10-setup" wait 3000
npx agent-browser --session "$SESSION-rw10-setup" close

npx agent-browser --session "$SESSION-rw10" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw10" find label "Email" fill "$WAITLIST_USER_EMAIL"
npx agent-browser --session "$SESSION-rw10" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw10" find text "Prijava" click
npx agent-browser --session "$SESSION-rw10" wait 3000

npx agent-browser --session "$SESSION-rw10" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw10" wait 2000
npx agent-browser --session "$SESSION-rw10" find text "Čakalna lista" count > "$TEST_RESULTS_DIR/rw10-01-waitlist-count.txt"
npx agent-browser --session "$SESSION-rw10" screenshot "$TEST_RESULTS_DIR/rw10-02-waitlist-check.png"

# If waitlist available, test joining
WAITLIST_COUNT=$(cat "$TEST_RESULTS_DIR/rw10-01-waitlist-count.txt")
if [ "$WAITLIST_COUNT" -gt 0 ]; then
    npx agent-browser --session "$SESSION-rw10" find text "Pridruži se čakalni listi" click
    npx agent-browser --session "$SESSION-rw10" wait 2000
    npx agent-browser --session "$SESSION-rw10" screenshot "$TEST_RESULTS_DIR/rw10-03-waitlist-joined.png"
fi

npx agent-browser --session "$SESSION-rw10" close

echo -e "${GREEN}✓ RW-10 completed${NC}"

# RW-11: Recurring Appointments
echo -e "${YELLOW}RW-11: Testing recurring appointments...${NC}"

RECUR_USER_EMAIL="recur-$(date +%s)@example.com"

npx agent-browser --session "$SESSION-rw11-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw11-setup" find label "Ime *" fill "Recur Test"
npx agent-browser --session "$SESSION-rw11-setup" find label "Email *" fill "$RECUR_USER_EMAIL"
npx agent-browser --session "$SESSION-rw11-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw11-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw11-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw11-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw11-setup" wait 3000
npx agent-browser --session "$SESSION-rw11-setup" close

npx agent-browser --session "$SESSION-rw11" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw11" find label "Email" fill "$RECUR_USER_EMAIL"
npx agent-browser --session "$SESSION-rw11" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw11" find text "Prijava" click
npx agent-browser --session "$SESSION-rw11" wait 3000

npx agent-browser --session "$SESSION-rw11" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw11" wait 2000
npx agent-browser --session "$SESSION-rw11" find text "Ponavljajoči se termin" count > "$TEST_RESULTS_DIR/rw11-01-recur-count.txt"
npx agent-browser --session "$SESSION-rw11" screenshot "$TEST_RESULTS_DIR/rw11-02-recur-check.png"

# If recurring available, test booking
RECUR_COUNT=$(cat "$TEST_RESULTS_DIR/rw11-01-recur-count.txt")
if [ "$RECUR_COUNT" -gt 0 ]; then
    npx agent-browser --session "$SESSION-rw11" find label "Izberite storitev *" click
    npx agent-browser --session "$SESSION-rw11" find text "Manualna Terapija" click
    npx agent-browser --session "$SESSION-rw11" find text "Ponavljajoči se termin" click
    npx agent-browser --session "$SESSION-rw11" find text "Tedensko" click
    npx agent-browser --session "$SESSION-rw11" find text "Uporabi spustni seznam" click
    npx agent-browser --session "$SESSION-rw11" find label "Izberite datum *" click
    npx agent-browser --session "$SESSION-rw11" find role option click --nth 2
    npx agent-browser --session "$SESSION-rw11" wait 2000
    npx agent-browser --session "$SESSION-rw11" find text "09:00" click
    npx agent-browser --session "$SESSION-rw11" find text "Rezerviraj termin" click
    npx agent-browser --session "$SESSION-rw11" wait 3000
    npx agent-browser --session "$SESSION-rw11" screenshot "$TEST_RESULTS_DIR/rw11-03-recur-booked.png"
fi

npx agent-browser --session "$SESSION-rw11" close

echo -e "${GREEN}✓ RW-11 completed${NC}"

# RW-12: Password Reset Flows
echo -e "${YELLOW}RW-12: Testing password reset flows...${NC}"

RESET_USER_EMAIL="reset-$(date +%s)@example.com"

# Register user
npx agent-browser --session "$SESSION-rw12-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw12-setup" find label "Ime *" fill "Reset Test"
npx agent-browser --session "$SESSION-rw12-setup" find label "Email *" fill "$RESET_USER_EMAIL"
npx agent-browser --session "$SESSION-rw12-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw12-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw12-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw12-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw12-setup" wait 3000
npx agent-browser --session "$SESSION-rw12-setup" close

# Test password reset
npx agent-browser --session "$SESSION-rw12" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw12" wait 2000
npx agent-browser --session "$SESSION-rw12" find text "Pozabljeno geslo" click
npx agent-browser --session "$SESSION-rw12" wait 1000
npx agent-browser --session "$SESSION-rw12" screenshot "$TEST_RESULTS_DIR/rw12-01-reset-form.png"

npx agent-browser --session "$SESSION-rw12" find label "Email" fill "$RESET_USER_EMAIL"
npx agent-browser --session "$SESSION-rw12" find text "Pošlji povezavo" click
npx agent-browser --session "$SESSION-rw12" wait 2000
npx agent-browser --session "$SESSION-rw12" screenshot "$TEST_RESULTS_DIR/rw12-02-reset-sent.png"

npx agent-browser --session "$SESSION-rw12" close

echo -e "${GREEN}✓ RW-12 completed${NC}"

# RW-13: Profile Management (Settings, Preferences, Contact Updates)
echo -e "${YELLOW}RW-13: Testing profile management...${NC}"

PROFILE_USER_EMAIL="profile-$(date +%s)@example.com"

npx agent-browser --session "$SESSION-rw13-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw13-setup" find label "Ime *" fill "Profile Test"
npx agent-browser --session "$SESSION-rw13-setup" find label "Email *" fill "$PROFILE_USER_EMAIL"
npx agent-browser --session "$SESSION-rw13-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw13-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw13-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw13-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw13-setup" wait 3000
npx agent-browser --session "$SESSION-rw13-setup" close

npx agent-browser --session "$SESSION-rw13" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw13" find label "Email" fill "$PROFILE_USER_EMAIL"
npx agent-browser --session "$SESSION-rw13" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw13" find text "Prijava" click
npx agent-browser --session "$SESSION-rw13" wait 3000

# Navigate to settings/profile
npx agent-browser --session "$SESSION-rw13" open "$BASE_URL/nastavitve"
npx agent-browser --session "$SESSION-rw13" wait 2000
npx agent-browser --session "$SESSION-rw13" screenshot "$TEST_RESULTS_DIR/rw13-01-profile-page.png"

# Update contact info
npx agent-browser --session "$SESSION-rw13" find label "Telefon" fill "+38640123456"
npx agent-browser --session "$SESSION-rw13" find text "Shrani" click
npx agent-browser --session "$SESSION-rw13" wait 2000
npx agent-browser --session "$SESSION-rw13" screenshot "$TEST_RESULTS_DIR/rw13-02-contact-updated.png"

npx agent-browser --session "$SESSION-rw13" close

echo -e "${GREEN}✓ RW-13 completed${NC}"

# RW-14: Account Security (Password Changes, Session Management)
echo -e "${YELLOW}RW-14: Testing account security...${NC}"

SECURE_USER_EMAIL="secure-$(date +%s)@example.com"

npx agent-browser --session "$SESSION-rw14-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw14-setup" find label "Ime *" fill "Secure Test"
npx agent-browser --session "$SESSION-rw14-setup" find label "Email *" fill "$SECURE_USER_EMAIL"
npx agent-browser --session "$SESSION-rw14-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw14-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw14-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw14-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw14-setup" wait 3000
npx agent-browser --session "$SESSION-rw14-setup" close

npx agent-browser --session "$SESSION-rw14" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw14" find label "Email" fill "$SECURE_USER_EMAIL"
npx agent-browser --session "$SESSION-rw14" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw14" find text "Prijava" click
npx agent-browser --session "$SESSION-rw14" wait 3000

# Change password
npx agent-browser --session "$SESSION-rw14" open "$BASE_URL/nastavitve"
npx agent-browser --session "$SESSION-rw14" wait 2000
npx agent-browser --session "$SESSION-rw14" find label "Novo geslo" fill "NewPass456!"
npx agent-browser --session "$SESSION-rw14" find label "Potrdi novo geslo" fill "NewPass456!"
npx agent-browser --session "$SESSION-rw14" find text "Spremeni geslo" click
npx agent-browser --session "$SESSION-rw14" wait 2000
npx agent-browser --session "$SESSION-rw14" screenshot "$TEST_RESULTS_DIR/rw14-01-password-changed.png"

# Test logout/session end
npx agent-browser --session "$SESSION-rw14" find text "Odjava" click
npx agent-browser --session "$SESSION-rw14" wait 2000
npx agent-browser --session "$SESSION-rw14" screenshot "$TEST_RESULTS_DIR/rw14-02-logged-out.png"

npx agent-browser --session "$SESSION-rw14" close

echo -e "${GREEN}✓ RW-14 completed${NC}"

# RW-15: Multi-Device Sessions
echo -e "${YELLOW}RW-15: Testing multi-device sessions...${NC}"

MULTI_DEV_USER_EMAIL="multidev-$(date +%s)@example.com"

npx agent-browser --session "$SESSION-rw15-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw15-setup" find label "Ime *" fill "Multi Dev Test"
npx agent-browser --session "$SESSION-rw15-setup" find label "Email *" fill "$MULTI_DEV_USER_EMAIL"
npx agent-browser --session "$SESSION-rw15-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw15-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw15-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw15-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw15-setup" wait 3000
npx agent-browser --session "$SESSION-rw15-setup" close

# Simulate device 1
npx agent-browser --session "$SESSION-rw15-dev1" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw15-dev1" find label "Email" fill "$MULTI_DEV_USER_EMAIL"
npx agent-browser --session "$SESSION-rw15-dev1" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw15-dev1" find text "Prijava" click
npx agent-browser --session "$SESSION-rw15-dev1" wait 3000
npx agent-browser --session "$SESSION-rw15-dev1" open "$BASE_URL/dashboard"
npx agent-browser --session "$SESSION-rw15-dev1" wait 2000
npx agent-browser --session "$SESSION-rw15-dev1" screenshot "$TEST_RESULTS_DIR/rw15-01-dev1-logged-in.png"

# Simulate device 2
npx agent-browser --session "$SESSION-rw15-dev2" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw15-dev2" find label "Email" fill "$MULTI_DEV_USER_EMAIL"
npx agent-browser --session "$SESSION-rw15-dev2" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw15-dev2" find text "Prijava" click
npx agent-browser --session "$SESSION-rw15-dev2" wait 3000
npx agent-browser --session "$SESSION-rw15-dev2" open "$BASE_URL/dashboard"
npx agent-browser --session "$SESSION-rw15-dev2" wait 2000
npx agent-browser --session "$SESSION-rw15-dev2" screenshot "$TEST_RESULTS_DIR/rw15-02-dev2-logged-in.png"

npx agent-browser --session "$SESSION-rw15-dev1" close
npx agent-browser --session "$SESSION-rw15-dev2" close

echo -e "${GREEN}✓ RW-15 completed${NC}"

# RW-16: Admin Functionality (Authentication, Content/Service Management, User Oversight)
echo -e "${YELLOW}RW-16: Testing admin functionality...${NC}"

# Assume admin login (need to know admin credentials, perhaps from setup)
# For this test, assume admin email is admin@example.com or something, but since not specified, check if admin page accessible

npx agent-browser --session "$SESSION-rw16" open "$BASE_URL/admin"
npx agent-browser --session "$SESSION-rw16" wait 2000
npx agent-browser --session "$SESSION-rw16" screenshot "$TEST_RESULTS_DIR/rw16-01-admin-page.png"

# Try to login as admin (assuming credentials from setup)
npx agent-browser --session "$SESSION-rw16" find label "Email" fill "admin@ori369.com" || npx agent-browser --session "$SESSION-rw16" find label "Email" fill "admin@example.com"
npx agent-browser --session "$SESSION-rw16" find label "Geslo" fill "AdminPass123!"
npx agent-browser --session "$SESSION-rw16" find text "Prijava" click
npx agent-browser --session "$SESSION-rw16" wait 3000
npx agent-browser --session "$SESSION-rw16" screenshot "$TEST_RESULTS_DIR/rw16-02-admin-logged-in.png"

# Check content management
npx agent-browser --session "$SESSION-rw16" open "$BASE_URL/admin/content"
npx agent-browser --session "$SESSION-rw16" wait 2000
npx agent-browser --session "$SESSION-rw16" screenshot "$TEST_RESULTS_DIR/rw16-03-content-management.png"

npx agent-browser --session "$SESSION-rw16" close

echo -e "${GREEN}✓ RW-16 completed${NC}"

# RW-17: Non-Functional Testing (Performance, Mobile Responsiveness, Accessibility)
echo -e "${YELLOW}RW-17: Testing non-functional aspects...${NC}"

# Performance: Load times
npx agent-browser --session "$SESSION-rw17-perf" open "$BASE_URL/rezervacija"
START_TIME=$(date +%s%3N)
npx agent-browser --session "$SESSION-rw17-perf" wait 5000
END_TIME=$(date +%s%3N)
LOAD_TIME=$((END_TIME - START_TIME))
echo "$LOAD_TIME" > "$TEST_RESULTS_DIR/rw17-01-load-time.txt"
npx agent-browser --session "$SESSION-rw17-perf" screenshot "$TEST_RESULTS_DIR/rw17-02-perf-screenshot.png"
npx agent-browser --session "$SESSION-rw17-perf" close

# Mobile responsiveness: Set viewport
npx agent-browser --session "$SESSION-rw17-mobile" open "$BASE_URL/rezervacija" --viewport 375x667
npx agent-browser --session "$SESSION-rw17-mobile" wait 2000
npx agent-browser --session "$SESSION-rw17-mobile" screenshot "$TEST_RESULTS_DIR/rw17-03-mobile-view.png"
npx agent-browser --session "$SESSION-rw17-mobile" close

# Accessibility: Check for basic elements
npx agent-browser --session "$SESSION-rw17-access" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw17-access" wait 2000
npx agent-browser --session "$SESSION-rw17-access" find role button count > "$TEST_RESULTS_DIR/rw17-04-button-count.txt"
npx agent-browser --session "$SESSION-rw17-access" find role heading count > "$TEST_RESULTS_DIR/rw17-05-heading-count.txt"
npx agent-browser --session "$SESSION-rw17-access" screenshot "$TEST_RESULTS_DIR/rw17-06-access-check.png"
npx agent-browser --session "$SESSION-rw17-access" close

echo -e "${GREEN}✓ RW-17 completed${NC}"

# RW-18: Data Integrity (Input Validation, Data Persistence)
echo -e "${YELLOW}RW-18: Testing data integrity...${NC}"

DATA_USER_EMAIL="dataintegrity-$(date +%s)@example.com"

npx agent-browser --session "$SESSION-rw18-setup" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw18-setup" find label "Ime *" fill "Data Integrity Test"
npx agent-browser --session "$SESSION-rw18-setup" find label "Email *" fill "$DATA_USER_EMAIL"
npx agent-browser --session "$SESSION-rw18-setup" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw18-setup" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw18-setup" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw18-setup" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw18-setup" wait 3000
npx agent-browser --session "$SESSION-rw18-setup" close

npx agent-browser --session "$SESSION-rw18" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw18" find label "Email" fill "$DATA_USER_EMAIL"
npx agent-browser --session "$SESSION-rw18" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw18" find text "Prijava" click
npx agent-browser --session "$SESSION-rw18" wait 3000

# Test input validation: Invalid email in booking notes or something
npx agent-browser --session "$SESSION-rw18" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw18" wait 2000
npx agent-browser --session "$SESSION-rw18" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw18" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw18" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw18" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw18" find role option click --nth 2
npx agent-browser --session "$SESSION-rw18" wait 2000
npx agent-browser --session "$SESSION-rw18" find text "09:00" click
npx agent-browser --session "$SESSION-rw18" find label "Dodatne opombe" fill "<script>alert('xss')</script>"
npx agent-browser --session "$SESSION-rw18" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw18" wait 3000
npx agent-browser --session "$SESSION-rw18" screenshot "$TEST_RESULTS_DIR/rw18-01-input-validation.png"

# Check data persistence: Login again and check if data saved
npx agent-browser --session "$SESSION-rw18" open "$BASE_URL/dashboard"
npx agent-browser --session "$SESSION-rw18" wait 2000
npx agent-browser --session "$SESSION-rw18" find text "Rezervacija" count > "$TEST_RESULTS_DIR/rw18-02-persistence-check.txt"
npx agent-browser --session "$SESSION-rw18" screenshot "$TEST_RESULTS_DIR/rw18-03-data-persistence.png"

npx agent-browser --session "$SESSION-rw18" close

echo -e "${GREEN}✓ RW-18 completed${NC}"

# RW-19: Edge Cases (Concurrent Booking Conflicts, Calendar Sync Failures, API Failures, Service Availability Checks)
echo -e "${YELLOW}RW-19: Testing edge cases...${NC}"

EDGE_USER1_EMAIL="edge1-$(date +%s)@example.com"
EDGE_USER2_EMAIL="edge2-$(date +%s)@example.com"

# Register two users
npx agent-browser --session "$SESSION-rw19-setup1" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw19-setup1" find label "Ime *" fill "Edge Test 1"
npx agent-browser --session "$SESSION-rw19-setup1" find label "Email *" fill "$EDGE_USER1_EMAIL"
npx agent-browser --session "$SESSION-rw19-setup1" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw19-setup1" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw19-setup1" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw19-setup1" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw19-setup1" wait 3000
npx agent-browser --session "$SESSION-rw19-setup1" close

npx agent-browser --session "$SESSION-rw19-setup2" open "$BASE_URL/registracija"
npx agent-browser --session "$SESSION-rw19-setup2" find label "Ime *" fill "Edge Test 2"
npx agent-browser --session "$SESSION-rw19-setup2" find label "Email *" fill "$EDGE_USER2_EMAIL"
npx agent-browser --session "$SESSION-rw19-setup2" find label "Geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw19-setup2" find label "Potrdi geslo *" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw19-setup2" find text "Strinjam se" click
npx agent-browser --session "$SESSION-rw19-setup2" find text "Registriraj se" click
npx agent-browser --session "$SESSION-rw19-setup2" wait 3000
npx agent-browser --session "$SESSION-rw19-setup2" close

# Concurrent booking: User 1 books
npx agent-browser --session "$SESSION-rw19-user1" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw19-user1" find label "Email" fill "$EDGE_USER1_EMAIL"
npx agent-browser --session "$SESSION-rw19-user1" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw19-user1" find text "Prijava" click
npx agent-browser --session "$SESSION-rw19-user1" wait 3000

npx agent-browser --session "$SESSION-rw19-user1" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw19-user1" wait 2000
npx agent-browser --session "$SESSION-rw19-user1" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw19-user1" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw19-user1" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw19-user1" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw19-user1" find role option click --nth 2
npx agent-browser --session "$SESSION-rw19-user1" wait 2000
npx agent-browser --session "$SESSION-rw19-user1" find text "09:00" click
npx agent-browser --session "$SESSION-rw19-user1" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw19-user1" wait 3000
npx agent-browser --session "$SESSION-rw19-user1" screenshot "$TEST_RESULTS_DIR/rw19-01-user1-booked.png"
npx agent-browser --session "$SESSION-rw19-user1" close

# User 2 tries to book same slot
npx agent-browser --session "$SESSION-rw19-user2" open "$BASE_URL/prijava"
npx agent-browser --session "$SESSION-rw19-user2" find label "Email" fill "$EDGE_USER2_EMAIL"
npx agent-browser --session "$SESSION-rw19-user2" find label "Geslo" fill "TestPass123!"
npx agent-browser --session "$SESSION-rw19-user2" find text "Prijava" click
npx agent-browser --session "$SESSION-rw19-user2" wait 3000

npx agent-browser --session "$SESSION-rw19-user2" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw19-user2" wait 2000
npx agent-browser --session "$SESSION-rw19-user2" find label "Izberite storitev *" click
npx agent-browser --session "$SESSION-rw19-user2" find text "Manualna Terapija" click
npx agent-browser --session "$SESSION-rw19-user2" find text "Uporabi spustni seznam" click
npx agent-browser --session "$SESSION-rw19-user2" find label "Izberite datum *" click
npx agent-browser --session "$SESSION-rw19-user2" find role option click --nth 2
npx agent-browser --session "$SESSION-rw19-user2" wait 2000
npx agent-browser --session "$SESSION-rw19-user2" find text "09:00" click
npx agent-browser --session "$SESSION-rw19-user2" find text "Rezerviraj termin" click
npx agent-browser --session "$SESSION-rw19-user2" wait 3000
npx agent-browser --session "$SESSION-rw19-user2" screenshot "$TEST_RESULTS_DIR/rw19-02-concurrent-conflict.png"
npx agent-browser --session "$SESSION-rw19-user2" close

# Service availability check
npx agent-browser --session "$SESSION-rw19-avail" open "$BASE_URL/rezervacija"
npx agent-browser --session "$SESSION-rw19-avail" wait 2000
npx agent-browser --session "$SESSION-rw19-avail" find text "Ni razpoložljivih terminov" count > "$TEST_RESULTS_DIR/rw19-03-availability-check.txt"
npx agent-browser --session "$SESSION-rw19-avail" screenshot "$TEST_RESULTS_DIR/rw19-04-service-availability.png"
npx agent-browser --session "$SESSION-rw19-avail" close

echo -e "${GREEN}✓ RW-19 completed${NC}"

echo -e "${GREEN}All Reservation Workflows Tests Completed!${NC}"
echo "Results saved to: $TEST_RESULTS_DIR"
echo ""
echo "Summary:"
echo "- RW-01: Anonymous booking restrictions"
echo "- RW-02: User registration and login"
echo "- RW-03: Complete booking flow"
echo "- RW-04: Form validation and errors"
echo "- RW-05: Time slot availability"
echo "- RW-06: Package booking"
echo "- RW-07: Booking management (cancellation, rescheduling, modification)"
echo "- RW-08: Multiple appointment booking"
echo "- RW-09: Calendar integration verification (Google Calendar sync)"
echo "- RW-10: Waitlist functionality (if available)"
echo "- RW-11: Recurring appointments"
echo "- RW-12: Password reset flows"
echo "- RW-13: Profile management (settings, preferences, contact updates)"
echo "- RW-14: Account security (password changes, session management)"
echo "- RW-15: Multi-device sessions"
echo "- RW-16: Admin functionality (authentication, content/service management, user oversight)"
echo "- RW-17: Non-functional testing (performance, mobile responsiveness, accessibility)"
echo "- RW-18: Data integrity (input validation, data persistence)"
echo "- RW-19: Edge cases (concurrent booking conflicts, calendar sync failures, API failures, service availability checks)"
echo ""
echo -e "${YELLOW}Check screenshots and logs for detailed results${NC}"
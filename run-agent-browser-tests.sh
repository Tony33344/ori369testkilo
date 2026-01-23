#!/bin/bash

# ORI369 Agent Browser Test Suite Runner
# Executes shopping and reservation workflow tests

set -e

# Configuration
BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command line arguments
RUN_SHOPPING=false
RUN_RESERVATION=false
RUN_COMBINED=false

if [ $# -eq 0 ]; then
    # Default: run all
    RUN_SHOPPING=true
    RUN_RESERVATION=true
    RUN_COMBINED=true
else
    for arg in "$@"; do
        case $arg in
            --shopping)
                RUN_SHOPPING=true
                ;;
            --reservation)
                RUN_RESERVATION=true
                ;;
            --combined)
                RUN_COMBINED=true
                ;;
            --all)
                RUN_SHOPPING=true
                RUN_RESERVATION=true
                RUN_COMBINED=true
                ;;
            --help)
                echo "Usage: $0 [--shopping] [--reservation] [--combined] [--all] [--help]"
                echo "  --shopping    Run shopping workflows only"
                echo "  --reservation Run reservation workflows only"
                echo "  --combined    Run combined and edge case workflows only"
                echo "  --all         Run all workflows (default)"
                echo "  --help        Show this help message"
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $arg${NC}"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
fi

# Test results directory
RESULTS_BASE="test-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="$RESULTS_BASE/$TIMESTAMP"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  ORI369 Agent Browser Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo "Timestamp: $TIMESTAMP"
echo "Base URL: $BASE_URL"
echo "Results: $RESULTS_DIR"
if $RUN_SHOPPING && $RUN_RESERVATION && $RUN_COMBINED; then
    echo "Test Suites: All"
elif $RUN_SHOPPING; then
    echo "Test Suites: Shopping"
elif $RUN_RESERVATION; then
    echo "Test Suites: Reservation"
elif $RUN_COMBINED; then
    echo "Test Suites: Combined/Edge Cases"
fi
echo ""

# Check if development server is running
echo -e "${YELLOW}Checking development server...${NC}"
if curl -s "$BASE_URL" > /dev/null; then
    echo -e "${GREEN}✓ Development server is running${NC}"
else
    echo -e "${RED}✗ Development server not accessible at $BASE_URL${NC}"
    echo -e "${YELLOW}Please start the development server with: npm run dev${NC}"
    exit 1
fi

# Check if agent-browser is available
echo -e "${YELLOW}Checking agent-browser availability...${NC}"
if command -v agent-browser &> /dev/null; then
    echo -e "${GREEN}✓ agent-browser is available${NC}"
else
    echo -e "${RED}✗ agent-browser not found${NC}"
    echo -e "${YELLOW}Please install agent-browser: npm install -g agent-browser${NC}"
    exit 1
fi

# Create results directory
mkdir -p "$RESULTS_DIR"

# Make test scripts executable
chmod +x test-shopping-workflows.sh
chmod +x test-reservation-workflows.sh
chmod +x test-combined-edge-workflows.sh

echo ""
echo -e "${GREEN}Starting test execution...${NC}"
echo ""

# Initialize durations
SHOPPING_DURATION=0
RESERVATION_DURATION=0
COMBINED_DURATION=0

# Run Shopping Workflows Tests
if $RUN_SHOPPING; then
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}  SHOPPING WORKFLOWS${NC}"
    echo -e "${BLUE}=======================================${NC}"

    START_TIME=$(date +%s)
    ./test-shopping-workflows.sh
    SHOPPING_DURATION=$(( $(date +%s) - START_TIME ))

    echo -e "${GREEN}Shopping tests completed in ${SHOPPING_DURATION}s${NC}"
    echo ""
fi

# Run Reservation Workflows Tests
if $RUN_RESERVATION; then
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}  RESERVATION WORKFLOWS${NC}"
    echo -e "${BLUE}=======================================${NC}"

    START_TIME=$(date +%s)
    ./test-reservation-workflows.sh
    RESERVATION_DURATION=$(( $(date +%s) - START_TIME ))

    echo -e "${GREEN}Reservation tests completed in ${RESERVATION_DURATION}s${NC}"
    echo ""
fi

# Run Combined and Edge Case Tests
if $RUN_COMBINED; then
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}  COMBINED & EDGE CASE WORKFLOWS${NC}"
    echo -e "${BLUE}=======================================${NC}"

    START_TIME=$(date +%s)
    ./test-combined-edge-workflows.sh
    COMBINED_DURATION=$(( $(date +%s) - START_TIME ))

    echo -e "${GREEN}Combined/Edge tests completed in ${COMBINED_DURATION}s${NC}"
    echo ""
fi

# Generate test summary
echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}  TEST SUMMARY${NC}"
echo -e "${BLUE}=======================================${NC}"

TOTAL_DURATION=$(( SHOPPING_DURATION + RESERVATION_DURATION + COMBINED_DURATION ))

echo "Test Run: $TIMESTAMP"
echo "Total Duration: ${TOTAL_DURATION}s"
echo ""

if $RUN_SHOPPING; then
    echo "Shopping Workflows: ${SHOPPING_DURATION}s"
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
fi

if $RUN_RESERVATION; then
    echo "Reservation Workflows: ${RESERVATION_DURATION}s"
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
fi

if $RUN_COMBINED; then
    echo "Combined & Edge Cases: ${COMBINED_DURATION}s"
    echo "- CW-01: Combined shopping and service purchase"
    echo "- EC-01: Network issues during checkout"
    echo "- EC-02: Session timeout behavior"
    echo ""
fi

# Check for test results
echo -e "${YELLOW}Test Results:${NC}"
RESULT_DIRS=""
if $RUN_SHOPPING; then RESULT_DIRS="$RESULT_DIRS $RESULTS_BASE/shopping/"; fi
if $RUN_RESERVATION; then RESULT_DIRS="$RESULT_DIRS $RESULTS_BASE/reservation/"; fi
if $RUN_COMBINED; then RESULT_DIRS="$RESULT_DIRS $RESULTS_BASE/combined/ $RESULTS_BASE/edge-cases/"; fi
echo "Screenshots:$RESULT_DIRS"
echo ""

# Count screenshots
SHOPPING_SCREENSHOTS=0
RESERVATION_SCREENSHOTS=0
COMBINED_SCREENSHOTS=0
EDGE_SCREENSHOTS=0

if $RUN_SHOPPING; then
    SHOPPING_SCREENSHOTS=$(find "$RESULTS_BASE/shopping" -name "*.png" 2>/dev/null | wc -l)
fi
if $RUN_RESERVATION; then
    RESERVATION_SCREENSHOTS=$(find "$RESULTS_BASE/reservation" -name "*.png" 2>/dev/null | wc -l)
fi
if $RUN_COMBINED; then
    COMBINED_SCREENSHOTS=$(find "$RESULTS_BASE/combined" -name "*.png" 2>/dev/null | wc -l)
    EDGE_SCREENSHOTS=$(find "$RESULTS_BASE/edge-cases" -name "*.png" 2>/dev/null | wc -l)
fi
TOTAL_SCREENSHOTS=$(( SHOPPING_SCREENSHOTS + RESERVATION_SCREENSHOTS + COMBINED_SCREENSHOTS + EDGE_SCREENSHOTS ))

echo "Screenshots captured: $TOTAL_SCREENSHOTS"
if $RUN_SHOPPING; then echo "- Shopping: $SHOPPING_SCREENSHOTS"; fi
if $RUN_RESERVATION; then echo "- Reservation: $RESERVATION_SCREENSHOTS"; fi
if $RUN_COMBINED; then
    echo "- Combined: $COMBINED_SCREENSHOTS"
    echo "- Edge Cases: $EDGE_SCREENSHOTS"
fi
echo ""

# Check for any errors in logs
ERROR_LOGS=$(find "$RESULTS_BASE" -name "*.txt" -exec grep -l "error\|fail\|✗" {} \; 2>/dev/null | wc -l)

if [ "$ERROR_LOGS" -gt 0 ]; then
    echo -e "${RED}⚠️  Found $ERROR_LOGS files with potential errors${NC}"
    echo "Check the following files for details:"
    find "$RESULTS_BASE" -name "*.txt" -exec grep -l "error\|fail\|✗" {} \; 2>/dev/null
    echo ""
else
    echo -e "${GREEN}✓ No error indicators found in logs${NC}"
    echo ""
fi

echo -e "${GREEN}Test execution completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review screenshots in test-results/ directories"
echo "2. Check log files for detailed output"
echo "3. Analyze any failed tests and update selectors if needed"
echo "4. Consider automating this test suite in CI/CD pipeline"
echo ""

# Create summary file
SUMMARY_FILE="$RESULTS_DIR/test-summary.txt"
cat > "$SUMMARY_FILE" << EOF
ORI369 Agent Browser Test Suite Summary
======================================

Test Run: $TIMESTAMP
Total Duration: ${TOTAL_DURATION}s
Base URL: $BASE_URL

Test Results:
- Shopping Workflows: ${SHOPPING_DURATION}s ($SHOPPING_SCREENSHOTS screenshots)
- Reservation Workflows: ${RESERVATION_DURATION}s ($RESERVATION_SCREENSHOTS screenshots)
- Combined & Edge Cases: ${COMBINED_DURATION}s ($COMBINED_SCREENSHOTS screenshots + $EDGE_SCREENSHOTS edge case screenshots)

Total Screenshots: $TOTAL_SCREENSHOTS
Potential Error Logs: $ERROR_LOGS

Directories:
- Shopping: test-results/shopping/
- Reservation: test-results/reservation/
- Combined: test-results/combined/
- Edge Cases: test-results/edge-cases/
EOF

echo -e "${BLUE}Summary saved to: $SUMMARY_FILE${NC}"
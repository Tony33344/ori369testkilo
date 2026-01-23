#!/bin/bash

# Unified Test Runner for ORI369
# Runs all test types and provides centralized reporting

set -e

# Configuration
BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_DIR="test-results/run-$TIMESTAMP"
LOG_FILE="$REPORT_DIR/run-log.txt"
SUMMARY_FILE="$REPORT_DIR/test-summary.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results tracking
declare -A test_results
declare -a test_names

# Initialize
init() {
    echo -e "${BLUE}=== ORI369 Unified Test Runner ===${NC}"
    echo "Timestamp: $TIMESTAMP"
    echo "Report Directory: $REPORT_DIR"
    echo ""

    mkdir -p "$REPORT_DIR"

    echo "=== ORI369 Test Run Started ===" > "$LOG_FILE"
    echo "Timestamp: $TIMESTAMP" >> "$LOG_FILE"
    echo "Base URL: $BASE_URL" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
}

# Log function
log() {
    echo "$(date '+%H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Run a test and track result
run_test() {
    local test_name="$1"
    local test_command="$2"
    local description="$3"

    test_names+=("$test_name")

    echo -e "${YELLOW}Running: $description${NC}"
    log "Starting test: $test_name - $description"

    if eval "$test_command" >> "$LOG_FILE" 2>&1; then
        test_results["$test_name"]="PASS"
        echo -e "${GREEN}✓ $test_name PASSED${NC}"
        log "✓ Test passed: $test_name"
        return 0
    else
        test_results["$test_name"]="FAIL"
        echo -e "${RED}✗ $test_name FAILED${NC}"
        log "✗ Test failed: $test_name"
        return 1
    fi
}

# Run Playwright tests
run_playwright_tests() {
    echo "Running Playwright E2E tests..."
    npm run test:e2e:headed -- --reporter=json --output="$REPORT_DIR/playwright-results"
}

# Run agent-browser reservation test
run_agent_reservation_test() {
    echo "Running agent-browser reservation test..."
    ./test-reservation-comprehensive.sh
}

# Run agent-browser shopping test
run_agent_shopping_test() {
    echo "Running agent-browser shopping workflow test..."
    ./test-shopping-workflows.sh
}

# Run agent-browser combined test
run_agent_combined_test() {
    echo "Running agent-browser combined workflow test..."
    ./test-combined-edge-workflows.sh
}

# Generate comprehensive report
generate_report() {
    local total_tests=${#test_names[@]}
    local passed_tests=0
    local failed_tests=0

    for test in "${test_names[@]}"; do
        if [ "${test_results[$test]}" = "PASS" ]; then
            ((passed_tests++))
        else
            ((failed_tests++))
        fi
    done

    # JSON summary
    cat > "$SUMMARY_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "baseUrl": "$BASE_URL",
  "totalTests": $total_tests,
  "passedTests": $passed_tests,
  "failedTests": $failed_tests,
  "successRate": $(echo "scale=2; $passed_tests * 100 / $total_tests" | bc 2>/dev/null || echo "0"),
  "results": {
EOF

    local first=true
    for test in "${test_names[@]}"; do
        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> "$SUMMARY_FILE"
        fi
        echo "    \"$test\": \"${test_results[$test]}\"" >> "$SUMMARY_FILE"
    done

    cat >> "$SUMMARY_FILE" << EOF
  },
  "reportDirectory": "$REPORT_DIR",
  "logFile": "$LOG_FILE"
}
EOF

    # Text summary
    local summary_text="$REPORT_DIR/test-summary.txt"
    cat > "$summary_text" << EOF
=== ORI369 Test Run Summary ===
Timestamp: $TIMESTAMP
Base URL: $BASE_URL

Test Results:
Total Tests: $total_tests
Passed: $passed_tests
Failed: $failed_tests
Success Rate: $(echo "scale=2; $passed_tests * 100 / $total_tests" | bc 2>/dev/null || echo "0")%

Detailed Results:
EOF

    for test in "${test_names[@]}"; do
        echo "- $test: ${test_results[$test]}" >> "$summary_text"
    done

    cat >> "$summary_text" << EOF

Report Directory: $REPORT_DIR
Log File: $LOG_FILE

Next Steps:
1. Review detailed logs in $LOG_FILE
2. Check screenshots in test-results/ subdirectories
3. Fix any failed tests
4. Re-run tests as needed
EOF

    echo ""
    echo -e "${BLUE}=== Test Run Complete ===${NC}"
    echo -e "${GREEN}Passed: $passed_tests${NC} | ${RED}Failed: $failed_tests${NC} | Total: $total_tests"
    echo ""
    echo "Reports saved to: $REPORT_DIR"
    echo "- Summary: $summary_text"
    echo "- JSON: $SUMMARY_FILE"
    echo "- Log: $LOG_FILE"
}

# Cleanup function
cleanup() {
    log "Cleaning up test sessions..."
    npx agent-browser session list 2>/dev/null | while read -r line; do
        session_name=$(echo "$line" | awk '{print $1}')
        if [[ $session_name == test-* ]] || [[ $session_name == reservation-* ]] || [[ $session_name == shopping-* ]] || [[ $session_name == combined-* ]]; then
            npx agent-browser --session "$session_name" close 2>/dev/null || true
        fi
    done
}

# Main execution
main() {
    init

    # Set cleanup trap
    trap cleanup EXIT

    local overall_success=true

    # Run Playwright tests
    if run_test "playwright-e2e" "run_playwright_tests" "Playwright E2E Tests"; then
        log "Playwright tests completed successfully"
    else
        log "Playwright tests failed"
        overall_success=false
    fi

    # Run agent-browser tests
    if run_test "agent-reservation" "run_agent_reservation_test" "Agent Browser Reservation Test"; then
        log "Agent reservation test completed successfully"
    else
        log "Agent reservation test failed"
        overall_success=false
    fi

    if run_test "agent-shopping" "run_agent_shopping_test" "Agent Browser Shopping Test"; then
        log "Agent shopping test completed successfully"
    else
        log "Agent shopping test failed"
        overall_success=false
    fi

    if run_test "agent-combined" "run_agent_combined_test" "Agent Browser Combined Test"; then
        log "Agent combined test completed successfully"
    else
        log "Agent combined test failed"
        overall_success=false
    fi

    # Generate final report
    generate_report

    if [ "$overall_success" = true ]; then
        echo -e "${GREEN}✓ All test suites completed successfully!${NC}"
        exit 0
    else
        echo -e "${RED}✗ Some tests failed. Check the reports for details.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
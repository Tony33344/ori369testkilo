# ORI369 Test Workflow - Improved Version

## Overview

This document describes the improved test workflow for the ORI369 website, featuring comprehensive testing with both Playwright and agent-browser automation.

## Test Types

### 1. Playwright E2E Tests
- **Location**: `tests/e2e/`
- **Purpose**: Traditional end-to-end testing with Playwright
- **Coverage**: Core user flows, authentication, booking process
- **Command**: `npm run test:e2e`

### 2. Agent Browser Tests
- **Purpose**: AI-friendly browser automation using agent-browser
- **Features**: Session management, screenshot capture, detailed logging
- **Types**:
  - **Reservation Tests**: Complete booking flow with authentication
  - **Shopping Tests**: Product browsing, cart management, checkout
  - **Combined Tests**: Multi-feature workflows and edge cases

## Key Improvements

### ✅ Fixed Authentication Flow
- **Issue**: Tests were failing because reservation page requires login before service selection
- **Solution**: Updated tests to handle authentication-first approach
- **Result**: Tests now properly register users, then proceed with booking

### ✅ Better Error Handling
- **Feature**: Comprehensive error logging and session cleanup
- **Benefit**: Failed tests don't leave hanging browser sessions
- **Recovery**: Automatic cleanup on script termination

### ✅ Centralized Reporting
- **Feature**: Unified test runner with JSON and text summaries
- **Benefit**: Easy to track test results across all test types
- **Output**: Timestamped reports with screenshots and logs

### ✅ Session Management
- **Feature**: Isolated browser sessions for each test
- **Benefit**: Tests don't interfere with each other
- **Cleanup**: Automatic session cleanup after tests complete

### ✅ Enhanced Screenshots
- **Feature**: Timestamped screenshots at each test step
- **Benefit**: Easy debugging of failed tests
- **Organization**: Screenshots organized by test type and step

## Running Tests

### Individual Test Types

```bash
# Playwright E2E tests
npm run test:e2e
npm run test:e2e:headed  # With browser visible
npm run test:e2e:ui      # With Playwright UI

# Agent Browser tests
npm run test:agent:reservation  # Reservation workflow
npm run test:agent:shopping     # Shopping workflow
npm run test:agent:combined     # Combined features
```

### Run All Tests

```bash
# Run complete test suite
npm run test:all
```

This will:
1. Run Playwright E2E tests
2. Run all agent-browser test suites
3. Generate comprehensive reports
4. Provide success/failure summary

## Test Results Structure

```
test-results/
├── run-20240123_143022/           # Unified run results
│   ├── test-summary.json          # JSON results
│   ├── test-summary.txt           # Text summary
│   └── run-log.txt                # Detailed log
├── reservation-comprehensive/     # Agent reservation results
│   ├── *.png                      # Screenshots
│   ├── test-log.txt               # Test log
│   └── test-summary.txt           # Summary
├── shopping/                      # Shopping test results
├── combined/                      # Combined test results
└── e2e/                          # Playwright results
    ├── test-results/             # Playwright output
    └── playwright-report/        # HTML report
```

## Test Scenarios Covered

### Reservation Flow
1. **Authentication Required**: Verify login prompt on reservation page
2. **User Registration**: Complete signup process
3. **Service Selection**: Choose therapy service
4. **Date/Time Selection**: Pick available slot
5. **Booking Submission**: Complete reservation
6. **Checkout Process**: Payment with UPN QR code

### Shopping Flow
1. **Product Browsing**: Search and filter products
2. **Cart Management**: Add/remove items, quantity adjustment
3. **Checkout Process**: Complete purchase with multiple payment options
4. **Edge Cases**: Out of stock, discounts, persistence

### Combined Workflows
1. **Multi-feature Testing**: Shopping + booking in same session
2. **Session Management**: User state persistence
3. **Error Recovery**: Network issues, timeouts
4. **Cross-feature Integration**: Cart + booking checkout

## Debugging Failed Tests

### 1. Check Logs
```bash
# View detailed test logs
cat test-results/run-*/run-log.txt

# Check specific test logs
cat test-results/reservation-comprehensive/test-log.txt
```

### 2. Review Screenshots
```bash
# Open screenshot directory
open test-results/reservation-comprehensive/
```

### 3. Run Tests with Browser Visible
```bash
# Run Playwright tests with browser visible
npm run test:e2e:headed

# Run agent tests with headed mode (modify scripts)
# Add --headed flag to agent-browser commands
```

### 4. Check Session State
```bash
# List active browser sessions
npx agent-browser session list

# Close hanging sessions
npx agent-browser --session <session-name> close
```

## Configuration

### Environment Variables
- `BASE_URL`: Test target URL (default: http://localhost:3000)
- `AGENT_BROWSER_SESSION`: Session naming prefix
- `AGENT_BROWSER_PROFILE`: Persistent browser profile

### Test Data
- **Test Users**: Auto-generated with timestamps
- **Test Services**: Uses existing database services
- **Test Products**: Uses existing shop products

## Best Practices

### Writing New Tests
1. **Use Session Isolation**: Each test gets unique session
2. **Include Screenshots**: Capture key interaction points
3. **Handle Timeouts**: Use appropriate wait times
4. **Log Important Steps**: Include descriptive log messages
5. **Cleanup Resources**: Sessions auto-cleanup on exit

### Debugging Tips
1. **Start Simple**: Test basic navigation first
2. **Check Selectors**: Use robust, unique selectors
3. **Verify State**: Confirm expected page state before actions
4. **Use Waits**: Let pages fully load before interacting
5. **Check Logs**: Review logs for hidden errors

## Maintenance

### Updating Tests
- **UI Changes**: Update selectors when UI changes
- **New Features**: Add test coverage for new functionality
- **Bug Fixes**: Update tests to match corrected behavior
- **Performance**: Monitor and optimize test execution time

### Regular Tasks
- **Clean Old Results**: Archive old test-results directories
- **Update Dependencies**: Keep Playwright and agent-browser updated
- **Review Coverage**: Ensure all user flows are tested
- **Performance Monitoring**: Track test execution times

## Troubleshooting

### Common Issues

**Tests Timeout**
- Check if dev server is running
- Verify database connectivity
- Look for slow network requests

**Selector Not Found**
- UI may have changed
- Use more robust selectors
- Check if element is dynamically loaded

**Session Conflicts**
- Close existing browser sessions
- Use unique session names
- Restart test environment

**Screenshot Failures**
- Check write permissions
- Verify directory exists
- Ensure sufficient disk space

## Future Improvements

### Planned Enhancements
- **Parallel Execution**: Run tests concurrently for speed
- **Visual Regression**: Screenshot comparison testing
- **Performance Testing**: Response time monitoring
- **Load Testing**: Multi-user scenario testing
- **API Testing**: Backend endpoint validation
- **Mobile Testing**: Responsive design verification

### Integration Opportunities
- **CI/CD Pipeline**: Automated testing on deployments
- **Monitoring**: Real-time test result dashboards
- **Notifications**: Alert on test failures
- **Historical Tracking**: Test result trends over time
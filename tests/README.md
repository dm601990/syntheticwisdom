# Synthetic Wisdom Testing Suite

This directory contains the comprehensive testing suite for the Synthetic Wisdom application. The tests are designed to ensure cross-browser compatibility, responsive design, and performance under various load conditions.

## Test Types

### 1. Cross-Browser Compatibility Tests
Located in `tests/cross-browser/`

These tests verify that the application works consistently across different browsers and platforms:
- Navigation flows
- UI rendering
- Search functionality
- Interactive elements

### 2. Responsive Design Tests
Located in `tests/responsive/`

These tests verify that the application is responsive and works well on different screen sizes:
- Mobile devices (smartphone)
- Tablet devices
- Desktop breakpoints

### 3. Load Testing
Located in `tests/load-testing/`

These tests assess the application's performance under various load conditions:
- Constant load (baseline performance)
- Ramp tests (gradually increasing load)
- Spike tests (sudden traffic surges)

## Prerequisites

Before running tests, ensure you have:

1. Installed Node.js (v16 or later)
2. Run `npm install` to install dependencies
3. For browser tests:
   - Run `npm run install:browsers` to install Playwright browser drivers
4. For load tests:
   - Install k6: https://k6.io/docs/get-started/installation/

## Running Tests

### Cross-Browser Tests
```bash
# Run all cross-browser tests
npm run test:browsers

# Run specific test file
npx playwright test tests/cross-browser/navigation.spec.ts
```

### Responsive Design Tests
```bash
# Run all responsive tests
npm run test:responsive

# Run with specific browser
npx playwright test tests/responsive/responsive.spec.ts --project=chromium
```

### Load Tests
```bash
# Run standard load test
npm run test:load

# Run stress test (higher load)
npm run test:load:stress

# Run spike test
npm run test:load:spike
```

### Run All Tests
```bash
npm run test:all
```

## Interpreting Test Results

### Playwright Test Results

After running Playwright tests, an HTML report is generated in the `playwright-report/` directory:

1. Open the report by running:
   ```bash
   npx playwright show-report
   ```

2. The report provides:
   - Test status (passed/failed)
   - Screenshots of failures
   - Execution time
   - Detailed error messages
   - Trace viewer for analyzing test execution

3. Common issues and solutions:
   - **Element not found**: Check if selectors are correct or if the element requires time to appear
   - **Timeout errors**: May indicate slow performance; consider increasing timeout or optimizing the application
   - **Visual differences**: Review screenshots to identify UI inconsistencies across browsers

### k6 Load Test Results

Load test results are stored in the `results/` directory as JSON files:

1. Key metrics to review:
   - **http_req_duration**: Response time (p95 should be under thresholds)
   - **http_req_failed**: Error rate (should be below 1% for normal operation)
   - **iterations**: Number of completed user flows
   - **vus**: Virtual user count at different stages

2. Visualizing results:
   ```bash
   # Install k6-reporter
   npm install -g k6-reporter
   
   # Generate HTML report from JSON results
   k6-reporter results/load-test-results.json
   ```

3. Performance interpretation:
   - **Good performance**: p95 < 800ms, error rate < 0.1%
   - **Acceptable performance**: p95 < 1500ms, error rate < 1%
   - **Poor performance**: p95 > 1500ms or error rate > 1%

4. Common bottlenecks:
   - Server CPU saturation
   - Database connection limits
   - Memory leaks under sustained load
   - Network I/O limitations

## Troubleshooting

### Browser Tests

1. **Tests fail inconsistently**:
   - Increase retry count in playwright.config.ts
   - Add explicit waits for dynamic content
   - Check for race conditions in your application

2. **Mobile tests failing but desktop passing**:
   - Verify responsive design implementation
   - Check touch event handlers
   - Ensure viewport-specific CSS is working correctly

3. **Specific browser failures**:
   - Check for browser-specific CSS prefixes
   - Verify polyfills for newer JavaScript features
   - Test with exact browser versions used in production

### Load Tests

1. **High error rates during load tests**:
   - Check server logs for errors
   - Verify database connection pool settings
   - Review API rate limiting configurations
   - Check for memory leaks or resource exhaustion

2. **Degrading performance over time**:
   - Look for memory leaks
   - Check database query performance
   - Review caching effectiveness
   - Verify connection pooling configurations

## CI/CD Integration

Tests are automatically run in the CI/CD pipeline. See `.github/workflows/testing.yml` for configuration details.

The workflow:
1. Runs on push to main/master branches and pull requests
2. Executes browser compatibility tests
3. Performs responsive design tests
4. Runs a simplified load test (to avoid overloading CI environment)
5. Stores test results as artifacts

## Extending the Test Suite

### Adding New Browser Tests

1. Create a new .spec.ts file in the appropriate directory
2. Follow the Playwright Page Object pattern for maintainability
3. Add the test to the relevant npm script in package.json

### Adding New Load Test Scenarios

1. Modify the load-test.js file or create scenario-specific files
2. Configure appropriate thresholds and virtual user counts
3. Add corresponding npm scripts for different scenarios

## Contact

For questions about the testing suite, contact the development team at dev@syntheticwisdom.com 
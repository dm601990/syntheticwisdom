import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Create custom metrics for tracking
const error_rate = new Rate('error_rate');
const homepage_load_time = new Trend('homepage_load_time');
const api_latency = new Trend('api_latency');

// Configuration for the load test scenarios
export const options = {
  // Define multiple scenarios for different types of load tests
  scenarios: {
    // Constant load - steady traffic
    constant_load: {
      executor: 'constant-arrival-rate',
      rate: 10, // 10 requests per second
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 10, // Initial VUs
      maxVUs: 50, // Maximum VUs if needed to maintain rate
    },
    
    // Ramp load - gradually increasing load
    ramp_load: {
      executor: 'ramping-arrival-rate',
      startRate: 5, // Starting at 5 requests per second
      timeUnit: '1s',
      stages: [
        { duration: '30s', target: 10 }, // Ramp up to 10 RPS over 30s
        { duration: '30s', target: 20 }, // Ramp up to 20 RPS over next 30s
        { duration: '30s', target: 50 }, // Ramp up to 50 RPS over next 30s
        { duration: '1m', target: 0 },   // Ramp down to 0 over 1m
      ],
      preAllocatedVUs: 5,
      maxVUs: 100,
    },
    
    // Spike test - sudden surge in traffic
    spike_test: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      stages: [
        { duration: '10s', target: 1 },   // Normal traffic
        { duration: '20s', target: 100 }, // Sudden spike to 100 RPS
        { duration: '30s', target: 100 }, // Stay at 100 RPS for 30s
        { duration: '10s', target: 1 },   // Back to normal
      ],
      preAllocatedVUs: 5,
      maxVUs: 200,
    },
  },
  
  // Define thresholds for acceptable performance
  thresholds: {
    'http_req_duration': ['p(95)<1000'], // 95% of requests should be under 1s
    'error_rate': ['rate<0.1'],          // Error rate should be below 10%
    'homepage_load_time': ['p(95)<2000'], // Homepage should load in under 2s
    'api_latency': ['p(95)<500'],       // API requests should respond in under 500ms
  },
};

// Default function for testing
export default function() {
  // Test the homepage
  let homepageResponse = http.get('http://localhost:3001/');
  
  // Record homepage load time
  homepage_load_time.add(homepageResponse.timings.duration);
  
  // Check if homepage loaded successfully
  check(homepageResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage has expected title': (r) => r.body && r.body.includes('Synthetic Wisdom'),
  }) || error_rate.add(1);
  
  // Simulate some think time - user is reading the homepage
  sleep(Math.random() * 3 + 1);
  
  // Test the API - get news articles
  let apiResponse = http.get('http://localhost:3001/api/news');
  
  // Record API latency
  api_latency.add(apiResponse.timings.duration);
  
  // Check API response
  check(apiResponse, {
    'API status is 200': (r) => r.status === 200,
    'API returns JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    'API contains articles': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data && Array.isArray(data.articles);
      } catch (e) {
        return false;
      }
    },
  }) || error_rate.add(1);
  
  // Simulate user browsing - go to toolkit page
  if (Math.random() > 0.5) {
    let toolkitResponse = http.get('http://localhost:3001/toolkit');
    
    check(toolkitResponse, {
      'toolkit status is 200': (r) => r.status === 200,
      'toolkit page has expected content': (r) => r.body && r.body.includes('AI Toolkit'),
    }) || error_rate.add(1);
    
    sleep(Math.random() * 2 + 1);
  }
  
  // Sometimes visit the silliness page
  if (Math.random() > 0.7) {
    let sillinessResponse = http.get('http://localhost:3001/silliness');
    
    check(sillinessResponse, {
      'silliness status is 200': (r) => r.status === 200,
      'silliness page has expected content': (r) => r.body && r.body.includes('Simulated Silliness'),
    }) || error_rate.add(1);
    
    sleep(Math.random() * 2 + 1);
  }
  
  // Add some final delay to simulate user behavior between page loads
  sleep(Math.random() * 2);
} 
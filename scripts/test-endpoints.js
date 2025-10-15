/**
 * Endpoint Testing Script
 * Tests all major API endpoints to ensure they're working
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testIds = {};

const makeRequest = async (method, endpoint, body = null, useAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (useAuth && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`${method} ${endpoint}: ${response.status} - ${data.message || data.success}`);
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error(`${method} ${endpoint}: Error -`, error.message);
    return { success: false, error: error.message };
  }
};

const testEndpoints = async () => {
  console.log('🚀 Starting API Endpoint Tests...\n');

  // 1. Health Check
  console.log('📋 Testing Health Check...');
  await makeRequest('GET', '/health');
  await makeRequest('GET', '/');

  // 2. Authentication
  console.log('\n🔐 Testing Authentication...');
  
  // Register
  const registerResult = await makeRequest('POST', '/auth/register', {
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    password: 'Password123',
    role: 'admin'
  });

  if (registerResult.success) {
    authToken = registerResult.data.data.token;
    testIds.userId = registerResult.data.data.user._id;
  }

  // Login
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: 'test@example.com',
    password: 'Password123'
  });

  if (loginResult.success) {
    authToken = loginResult.data.data.token;
  }

  // Profile operations
  await makeRequest('GET', '/auth/profile', null, true);
  await makeRequest('PUT', '/auth/profile', { name: 'Test User Updated' }, true);

  // 3. Users
  console.log('\n👥 Testing Users...');
  await makeRequest('GET', '/users', null, true);
  await makeRequest('GET', '/users/stats', null, true);
  await makeRequest('GET', '/users/search?q=test', null, true);

  // 4. Participants
  console.log('\n🎓 Testing Participants...');
  
  const participantResult = await makeRequest('POST', '/participants', {
    name: 'Test Participant',
    email: 'participant@example.com',
    phone: '9876543211',
    school: 'Test School',
    class: '12th',
    type: 'school',
    teamID: 'TEAM001'
  });

  if (participantResult.success) {
    testIds.participantId = participantResult.data.data._id;
  }

  await makeRequest('GET', '/participants', null, true);
  await makeRequest('GET', '/participants/stats', null, true);
  await makeRequest('GET', '/participants/search?q=test', null, true);

  if (testIds.participantId) {
    await makeRequest('PUT', `/participants/${testIds.participantId}/verify`, null, true);
  }

  // 5. Schools
  console.log('\n🏫 Testing Schools...');
  
  const schoolResult = await makeRequest('POST', '/schools', {
    name: 'Test School',
    moderatorEmail: 'moderator@testschool.com',
    coordinatorEmail: 'coordinator@testschool.com',
    city: 'Test City'
  }, true);

  if (schoolResult.success) {
    testIds.schoolId = schoolResult.data.data._id;
  }

  await makeRequest('GET', '/schools', null, true);
  await makeRequest('GET', '/schools/stats', null, true);

  if (testIds.schoolId) {
    await makeRequest('PUT', `/schools/${testIds.schoolId}/verify`, null, true);
  }

  // 6. Results
  console.log('\n🏆 Testing Results...');
  
  const resultResult = await makeRequest('POST', '/results', {
    round: 'preliminary',
    teamId: 'TEAM001',
    position: '1st'
  }, true);

  if (resultResult.success) {
    testIds.resultId = resultResult.data.data._id;
  }

  await makeRequest('GET', '/results', null, true);
  await makeRequest('GET', '/results/stats', null, true);
  await makeRequest('GET', '/results/round/preliminary/leaderboard', null, true);

  // 7. Tracking
  console.log('\n📊 Testing Tracking...');
  
  await makeRequest('POST', '/tracking/visit', {
    visitorId: 'test_visitor_123',
    url: '/test'
  });

  await makeRequest('GET', '/tracking/visitors', null, true);
  await makeRequest('GET', '/tracking/visitors/stats', null, true);
  await makeRequest('GET', '/tracking/logs', null, true);
  await makeRequest('GET', '/tracking/logs/stats', null, true);

  console.log('\n✅ API Endpoint Tests Completed!');
  console.log('\nTest IDs generated:');
  console.log(JSON.stringify(testIds, null, 2));
};

// Run tests
testEndpoints().catch(console.error);
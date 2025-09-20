// Test script for the symptom checker API
// Run with: node BACKEND/test-symptom-checker.js

import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testSymptomData = {
  symptoms: [
    {
      name: "Fever",
      severity: 8,
      duration: "3-5 days"
    },
    {
      name: "Cough",
      severity: 6,
      duration: "1 week"
    },
    {
      name: "Headache",
      severity: 7,
      duration: "3-5 days"
    }
  ],
  patientInfo: {
    age: 30,
    gender: "M",
    medicalHistory: ["diabetes"],
    allergies: ["peanuts"],
    currentMedications: ["metformin"]
  }
};

async function testSymptomAnalysis() {
  console.log('🧪 Testing Symptom Analysis API...\n');
  
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSymptomData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Symptom analysis successful!');
      console.log('\n📊 Analysis Result:');
      console.log('Disease:', data.data.disease.name);
      console.log('Severity:', data.data.severity.level + '/10 (' + data.data.severity.description + ')');
      console.log('Emergency:', data.data.emergency?.isEmergency ? 'YES ⚠️' : 'No');
      console.log('Medications suggested:', data.data.medications.length);
      console.log('Recommendations:', data.data.recommendations.length);
      
      if (data.data.disclaimer?.includes('mock')) {
        console.log('\n⚠️  Using mock response (Gemini API not configured)');
      } else {
        console.log('\n🤖 Powered by Gemini AI');
      }
    } else {
      console.log('❌ Symptom analysis failed:');
      console.log('Status:', response.status);
      console.log('Error:', data.message || data.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 5000');
  }
}

async function testSymptomsList() {
  console.log('\n🧪 Testing Symptoms List API...\n');
  
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms/list`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Symptoms list retrieved successfully!');
      console.log('Total symptoms available:', data.data.total);
      console.log('Categories:', Object.keys(data.data.categories).join(', '));
    } else {
      console.log('❌ Failed to get symptoms list:', data.message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testValidation() {
  console.log('\n🧪 Testing Symptom Validation API...\n');
  
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms: testSymptomData.symptoms })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Symptom validation successful!');
      console.log('Total symptoms validated:', data.data.totalSymptoms);
      console.log('Average severity:', data.data.averageSeverity);
    } else {
      console.log('❌ Validation failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🔬 Symptom Checker API Test Suite');
  console.log('==================================\n');
  
  await testSymptomAnalysis();
  await testSymptomsList();
  await testValidation();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Notes:');
  console.log('- If you see mock responses, add your GEMINI_API_KEY to backend/.env');
  console.log('- Make sure the backend server is running: npm run dev');
  console.log('- The symptom checker works without authentication as requested');
}

runTests();
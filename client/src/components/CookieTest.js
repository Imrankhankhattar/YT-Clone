import React, { useState } from 'react';
import api from '../utils/api';

const CookieTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCookieTransmission = async () => {
    setLoading(true);
    try {
      // Test 1: Set a cookie
      const setResponse = await api.get('/api/auth/google/test-cookie');
      console.log('Cookie set:', setResponse.data);
      
      // Test 2: Check if cookie is sent back
      const checkResponse = await api.get('/api/auth/google/test-frontend-cookies');
      console.log('Cookie check:', checkResponse.data);
      
      setResult({
        setCookie: setResponse.data,
        checkCookie: checkResponse.data
      });
    } catch (error) {
      console.error('Cookie test error:', error);
      setResult({ error: error.response?.data || error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/channels/owner');
      setResult({ authTest: response.data });
    } catch (error) {
      console.error('Auth test error:', error);
      setResult({ authError: error.response?.data || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Cookie Transmission Test</h3>
      <button onClick={testCookieTransmission} disabled={loading}>
        {loading ? 'Testing...' : 'Test Cookie Transmission'}
      </button>
      <button onClick={testAuthEndpoint} disabled={loading} style={{ marginLeft: '10px' }}>
        {loading ? 'Testing...' : 'Test Auth Endpoint'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h4>Results:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CookieTest; 
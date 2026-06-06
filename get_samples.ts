async function getSamples() {
  const API_URL = 'http://localhost:5000/api';
  
  // 1. Login
  let res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@vendorbridge.com', password: 'admin123' })
  });
  const loginData = await res.json();
  const token = loginData.data?.token;
  
  // Truncate the token for output readability
  if (loginData.data?.token) {
    loginData.data.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  }

  console.log("=== LOGIN ===");
  console.log(JSON.stringify(loginData, null, 2));

  if (!token) return;

  // 2. Vendors List
  res = await fetch(`${API_URL}/vendors`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const vendorsData = await res.json();
  if (vendorsData.data && vendorsData.data.length > 1) {
    vendorsData.data = [vendorsData.data[0], { "_note": "remaining items truncated" }];
  }
  console.log("\n=== VENDORS LIST ===");
  console.log(JSON.stringify(vendorsData, null, 2));

  // 3. RFQ List
  res = await fetch(`${API_URL}/rfqs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const rfqsData = await res.json();
  if (rfqsData.data && rfqsData.data.length > 1) {
    rfqsData.data = [rfqsData.data[0], { "_note": "remaining items truncated" }];
  }
  console.log("\n=== RFQ LIST ===");
  console.log(JSON.stringify(rfqsData, null, 2));

  // Get RFQ ID for comparison
  const rfqId = rfqsData.data?.[0]?.id;
  
  if (rfqId) {
    // 4. Comparison Endpoint
    res = await fetch(`${API_URL}/comparisons/${rfqId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const comparisonData = await res.json();
    console.log("\n=== COMPARISON ENDPOINT ===");
    console.log(JSON.stringify(comparisonData, null, 2));
  }

  // 5. Dashboard Endpoint
  res = await fetch(`${API_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const dashboardData = await res.json();
  if (dashboardData.data?.recentActivity?.length > 2) {
      dashboardData.data.recentActivity = [dashboardData.data.recentActivity[0], { "_note": "remaining activity truncated" }];
  }
  console.log("\n=== DASHBOARD ENDPOINT ===");
  console.log(JSON.stringify(dashboardData, null, 2));
}

getSamples().catch(console.error);

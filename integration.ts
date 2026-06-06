async function runTests() {
  const API_URL = 'http://localhost:5000/api';
  let adminToken = '';
  let officerToken = '';
  let managerToken = '';
  let vendorToken = '';

  let vendorId = '';
  let rfqId = '';
  let quotationId = '';
  let purchaseOrderId = '';
  let invoiceId = '';

  const reportError = (step: string, data: any) => {
    console.error(`❌ [FAILED] ${step}`);
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  };

  const reportSuccess = (step: string) => {
    console.log(`✅ [PASSED] ${step}`);
  };

  // 1. Logins
  let res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@vendorbridge.com', password: 'admin123' })
  });
  let data = await res.json();
  if (!data.success) return reportError('Admin Login', data);
  adminToken = data.data.token;
  reportSuccess('Admin Login');

  res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'officer@vendorbridge.com', password: 'officer123' })
  });
  data = await res.json();
  if (!data.success) return reportError('Officer Login', data);
  officerToken = data.data.token;

  res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'manager@vendorbridge.com', password: 'manager123' })
  });
  data = await res.json();
  if (!data.success) return reportError('Manager Login', data);
  managerToken = data.data.token;

  res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'vendor1@test.com', password: 'vendor123' })
  });
  data = await res.json();
  if (!data.success) return reportError('Vendor Login', data);
  vendorToken = data.data.token;
  const vendorUserId = data.data.user.id;
  reportSuccess('Other Logins');

  // 2. Auth ME
  res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  data = await res.json();
  if (!data.success || data.data.email !== 'admin@vendorbridge.com') return reportError('Auth ME', data);
  reportSuccess('Auth ME');

  // 2.5 Register User
  const timestamp = Date.now();
  res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ name: 'New Vendor', email: `newvendor${timestamp}@test.com`, password: 'vendor123', role: 'VENDOR' })
  });
  data = await res.json();
  if (!data.success) return reportError('Register User', data);
  reportSuccess('Register User');

  // 3. Create Vendor
  res = await fetch(`${API_URL}/vendors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ name: `Test Vendor Co ${timestamp}`, email: `testvendor${timestamp}@company.com`, phone: '1234567890', gstNumber: `22TEST${timestamp.toString().slice(-6)}Z1`, category: 'Testing' })
  });
  data = await res.json();
  if (!data.success) return reportError('Create Vendor', data);
  vendorId = data.data.id;
  reportSuccess('Create Vendor');

  // 4. Update Vendor
  res = await fetch(`${API_URL}/vendors/${vendorId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'INACTIVE' })
  });
  data = await res.json();
  if (!data.success) return reportError('Update Vendor', data);
  reportSuccess('Update Vendor');

  // Get active vendors to get vendor1's profile id
  res = await fetch(`${API_URL}/vendors?search=ABC`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  data = await res.json();
  if (!data.success || data.data.length === 0) return reportError('Get Vendor ID', data);
  const vendor1ProfileId = data.data[0].id;

  // List all vendors
  res = await fetch(`${API_URL}/vendors`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('List Vendors', data);
  reportSuccess('List Vendors');

  // Delete vendor
  res = await fetch(`${API_URL}/vendors/${vendorId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('Delete Vendor', data);
  reportSuccess('Delete Vendor');

  // 5. Create RFQ
  res = await fetch(`${API_URL}/rfqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${officerToken}` },
    body: JSON.stringify({ title: 'Test Procurement', description: 'Testing end to end', quantity: 10, deadline: new Date(Date.now() + 86400000).toISOString() })
  });
  data = await res.json();
  if (!data.success) return reportError('Create RFQ', data);
  rfqId = data.data.id;
  reportSuccess('Create RFQ');

  // Update RFQ
  res = await fetch(`${API_URL}/rfqs/${rfqId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${officerToken}` },
    body: JSON.stringify({ description: 'Testing end to end updated' })
  });
  data = await res.json();
  if (!data.success) return reportError('Update RFQ', data);
  reportSuccess('Update RFQ');

  // List RFQs
  res = await fetch(`${API_URL}/rfqs`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('List RFQs', data);
  reportSuccess('List RFQs');

  // Delete RFQ (Create a dummy one first)
  res = await fetch(`${API_URL}/rfqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${officerToken}` },
    body: JSON.stringify({ title: 'To Be Deleted', description: 'Testing deletion', quantity: 1, deadline: new Date(Date.now() + 86400000).toISOString() })
  });
  const dummyRfq = await res.json();
  res = await fetch(`${API_URL}/rfqs/${dummyRfq.data.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('Delete RFQ', data);
  reportSuccess('Delete RFQ');

  // 6. Submit Quotation
  res = await fetch(`${API_URL}/quotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${vendorToken}` },
    body: JSON.stringify({ rfqId, vendorId: vendor1ProfileId, price: 500, deliveryDays: 2 })
  });
  data = await res.json();
  if (!data.success) return reportError('Submit Quotation', data);
  quotationId = data.data.id;
  reportSuccess('Submit Quotation');

  // Update Quotation
  res = await fetch(`${API_URL}/quotations/${quotationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${vendorToken}` },
    body: JSON.stringify({ notes: 'Updated notes' })
  });
  data = await res.json();
  if (!data.success) return reportError('Update Quotation', data);
  reportSuccess('Update Quotation');

  // List Quotations
  res = await fetch(`${API_URL}/quotations`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('List Quotations', data);
  reportSuccess('List Quotations');

  // 7. Compare Quotations
  res = await fetch(`${API_URL}/comparisons/${rfqId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('Compare Quotations', data);
  if (!data.data.quotations[0].lowestPrice) return reportError('Compare Quotations Lowest Price Flag missing', data);
  reportSuccess('Compare Quotations');

  // 8. Approve Quotation
  res = await fetch(`${API_URL}/approvals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${managerToken}` },
    body: JSON.stringify({ quotationId, status: 'APPROVED', remarks: 'Looks good' })
  });
  data = await res.json();
  if (!data.success) return reportError('Approve Quotation', data);
  reportSuccess('Approve Quotation');

  // List Approvals
  res = await fetch(`${API_URL}/approvals`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${managerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('List Approvals', data);
  reportSuccess('List Approvals');

  // 9. Generate Purchase Order
  res = await fetch(`${API_URL}/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${officerToken}` },
    body: JSON.stringify({ quotationId })
  });
  data = await res.json();
  if (!data.success) return reportError('Generate PO', data);
  purchaseOrderId = data.data.id;
  reportSuccess('Generate PO');

  // List Purchase Orders
  res = await fetch(`${API_URL}/purchase-orders`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('List POs', data);
  reportSuccess('List POs');

  // Get Purchase Order by ID
  res = await fetch(`${API_URL}/purchase-orders/${purchaseOrderId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('Get PO', data);
  reportSuccess('Get PO');

  // 10. Generate Invoice
  res = await fetch(`${API_URL}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${officerToken}` },
    body: JSON.stringify({ purchaseOrderId })
  });
  data = await res.json();
  if (!data.success) return reportError('Generate Invoice', data);
  invoiceId = data.data.id;
  reportSuccess('Generate Invoice');

  // Get Invoice
  res = await fetch(`${API_URL}/invoices/${invoiceId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('Get Invoice', data);
  reportSuccess('Get Invoice');

  // 11. PDF Download
  res = await fetch(`${API_URL}/invoices/${invoiceId}/pdf`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${officerToken}` }
  });
  const contentType = res.headers.get('content-type');
  if (contentType !== 'application/pdf') {
    const errText = await res.text();
    return reportError('PDF Download', { message: 'Wrong content type: ' + contentType, body: errText });
  }
  const buffer = await res.arrayBuffer();
  if (buffer.byteLength === 0) return reportError('PDF Download', { message: 'Empty PDF buffer' });
  reportSuccess('PDF Download');

  // 12. Send Email
  res = await fetch(`${API_URL}/invoices/${invoiceId}/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${officerToken}` },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  data = await res.json();
  if (!data.success) return reportError('Send Email', data);
  reportSuccess('Send Email');

  // 13. Dashboard Stats
  res = await fetch(`${API_URL}/dashboard/stats`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  data = await res.json();
  if (!data.success) return reportError('Dashboard Stats', data);
  if (!data.data.recentActivity) return reportError('Dashboard Stats Recent Activity Missing', data);
  reportSuccess('Dashboard Stats');

  console.log('🎉 ALL INTEGRATION TESTS PASSED!');
}

runTests().catch(console.error);

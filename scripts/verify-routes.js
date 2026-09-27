async function testAllUrls() {
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/explore',
    'http://localhost:3000/studio',
    'http://localhost:3000/studio/capture',
    'http://localhost:3000/studio/onboarding',
    'http://localhost:3000/studio/orders',
    'http://localhost:3000/studio/sunil-warli-palghar',
    'http://localhost:3000/portal',
    'http://localhost:3000/portal/onboarding',
    'http://localhost:3000/portal/rfq/new',
    'http://localhost:3000/cart',
    'http://localhost:3000/admin/ondc-test-harness',
    'http://localhost:3000/styleguide',
    'http://localhost:3000/api/products',
  ];

  console.log('--- ROUTE HEALTH CHECK ---');
  let allPass = true;
  for (const u of urls) {
    try {
      const res = await fetch(u);
      const isOk = res.status === 200;
      console.log(`${isOk ? '✓' : '✗'} [HTTP ${res.status}] ${u}`);
      if (!isOk) allPass = false;
    } catch (err) {
      console.log(`✗ [ERROR] ${u}:`, err.message);
      allPass = false;
    }
  }

  if (allPass) {
    console.log('--- ALL ROUTES OPERATIONAL & HEALTHY ---');
  }
}

testAllUrls();

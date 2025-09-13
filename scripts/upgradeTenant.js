
// Simple CLI helper to POST upgrade. Use: node scripts/upgradeTenant.js acme <ADMIN_TOKEN>
const [,, slug, token] = process.argv;
if (!slug || !token) {
  console.error('Usage: node scripts/upgradeTenant.js <slug> <ADMIN_JWT_TOKEN>');
  process.exit(1);
}

(async ()=> {
  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${slug}/upgrade`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
})();

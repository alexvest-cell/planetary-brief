
const TEST_PORT = 5174; // Based on recent logs
const TEST_EMAIL = 'proxy_test_' + Date.now() + '@example.com';
const TEST_TAG_ID = '16182843'; // Climate tag

console.log(`Testing Proxy via http://localhost:${TEST_PORT}/api/newsletter/subscribe...`);

try {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: TEST_EMAIL,
            topics: [TEST_TAG_ID]
        })
    });

    console.log('Status:', res.status, res.statusText);

    if (!res.ok) {
        const text = await res.text();
        console.log('Error Body:', text);
    } else {
        const json = await res.json();
        console.log('Success Body:', JSON.stringify(json, null, 2));
    }

} catch (err) {
    console.error('Fetch Error:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
}

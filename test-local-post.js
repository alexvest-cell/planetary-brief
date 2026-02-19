
const url = 'http://localhost:3000/api/newsletter/subscribe';
const body = {
    email: 'debug_local_post_' + Date.now() + '@test.com',
    topics: ['16182843']
};

console.log('Posting to:', url);

try {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response:', text);
} catch (err) {
    console.error('Fetch Error:', err);
}

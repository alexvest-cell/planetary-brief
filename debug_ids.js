import http from 'http';

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/articles',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const articles = JSON.parse(data);
            console.log('Total Articles:', articles.length);

            // Check for Design Demo Placeholder IDs
            const configIds = [
                'hero-demo-1',
                'placeholder-policy-1',
                'placeholder-policy-2',
                'placeholder-policy-3',
                'placeholder-policy-4',
                'placeholder-climate-1'
            ];

            console.log('--- Checking Config IDs ---');
            configIds.forEach(id => {
                const found = articles.find(a => a.id === id);
                console.log(`ID: ${id} -> ${found ? 'FOUND' : 'MISSING'}`);
            });

            // if (articles.length > 0) {
            //     console.log('--- Sample Available Articles ---');
            //     articles.slice(0, 15).forEach(a => {
            //         console.log(`[${a.id}] ${a.title} (${a.category})`);
            //     });
            // }

        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data preview:', data.substring(0, 200));
        }
    });
});

req.on('error', (e) => {
    console.error('Request error:', e);
});

req.end();

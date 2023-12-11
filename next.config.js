module.exports = {
    reactStrictMode: true,
    env: {
        // your environment variables
    },
    async headers() {
        return [
            {
                source: '/public/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store',
                        cache: 'no-store',
                    },
                ],
            },
        ];
    },
};

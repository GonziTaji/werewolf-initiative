const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    pwa: {
        dest: 'public',
        register: true,
        skipWaiting: true,
    },
    reactStrictMode: true,
});

module.exports = nextConfig;

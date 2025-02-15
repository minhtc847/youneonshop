import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bizweb.dktcdn.net',
                port: '', // Leave empty unless you need to specify a custom port
                pathname: '/**', // Match all paths on the domain
            },
        ],
    },
};
export default nextConfig;

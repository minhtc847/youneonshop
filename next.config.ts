import { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "bizweb.dktcdn.net",
                port: "",
                pathname: "/**",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true, // Ignore ESLint errors
    },
    typescript: {
        ignoreBuildErrors: true, // Ignore TypeScript errors
    },
    output: "standalone",
};

export default nextConfig;

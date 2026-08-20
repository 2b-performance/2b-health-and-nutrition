/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Gera um servidor mínimo autocontido em .next/standalone — imagem Docker enxuta.
  output: "standalone",
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Netlify
  output: 'export',
  // Deshabilitar la optimización de imágenes para exportación estática
  images: {
    unoptimized: true,
  },
  // Asegurarse de que las rutas API no se incluyan en la exportación
  // ya que no funcionarán en un despliegue estático
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

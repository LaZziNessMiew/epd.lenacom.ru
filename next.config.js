/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //true - dev mode; false - prod mode
  images: {
    domains: ['localhost', 'tuimada.ru', 'tumd.ru', 'edk.tuimada.ru', 'epd.lenacom.ru'],
  },
}


module.exports = nextConfig

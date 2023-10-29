/** @type {import("next").NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        BEARER_EMAIL: process.env.BEARER_EMAIL,
        BEARER_PASSWORD: process.env.BEARER_PASSWORD,
      },
}

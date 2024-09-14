/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { isServer }) {
        // Add the node-loader to process .node files
        config.module.rules.push({
          test: /\.node$/,
          use: 'node-loader',
        });
    
        return config;
      },

    transpilePackages:['@lobehub/ui']
};

export default nextConfig;

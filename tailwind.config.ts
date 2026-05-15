import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#17211d',
        leaf: '#1f7a5b',
        clay: '#b55b3d',
        mist: '#eef4f0',
      },
    },
  },
  plugins: [],
};

export default config;

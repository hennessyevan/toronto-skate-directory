const httpProxy = require('http-proxy')
const proxy = httpProxy.createServer({ target: 'http://localhost:4000' })

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-babel',
  ],
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => proxy.web(req, res),
    },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    knownEntrypoints: ['react/jsx-runtime'],
  },
  devOptions: {
    open: 'none',
  },
  buildOptions: {},
}

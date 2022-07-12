module.exports = {
  port: 8080,
  rewrite: [
    {
      from: '/api/(.*)',
      to: 'http://localhost:5000/api/$1',
    },
  ],
  directory: 'build',
  spa: 'index.html',
  logFormat: 'stats',
};

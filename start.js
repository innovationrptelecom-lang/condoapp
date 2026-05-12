// start.js
const { nextStart } = require('next/dist/cli/next-start');
const port = process.env.PORT || '3000';   // Hostinger injeta PORT; local cai no 3000
nextStart(['-p', port]).catch((err) => {
  console.error(err);
  process.exit(1);
});

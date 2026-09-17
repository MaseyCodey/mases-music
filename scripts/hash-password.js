'use strict';
const bcrypt=require('bcryptjs');
const password=process.argv[2];
if(!password||password.length<10){console.error('Usage: npm run hash-password -- "your-password-with-10+-characters"');process.exit(1)}
bcrypt.hash(password,12).then(console.log);

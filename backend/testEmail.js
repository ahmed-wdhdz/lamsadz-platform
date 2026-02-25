require('dotenv').config();
require('./utils/sendEmail')('ahmedahmd783ei@gmail.com', 'test', 'test')
    .then(console.log)
    .catch(console.error);

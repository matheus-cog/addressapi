require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const output = './swagger_output.json';
const endpoints = ['./endpoints.js'];
const doc = {
    info: {
      version: process.env.VERSION,              // by default: '1.0.0'
      title: process.env.APP_NAME,               // by default: 'REST API'
      description: process.env.DESCRIPTION,      // by default: ''
    },
    host: process.env.HOST+":"+process.env.PORT, // by default: 'localhost:3000'
    basePath: '/'
};

swaggerAutogen(output, endpoints, doc).then(() => { require('./index.js') });
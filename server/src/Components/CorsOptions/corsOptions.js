//corsOptions.js

require("dotenv").config();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

module.exports = corsOptions;



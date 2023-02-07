
const dotenv = require('dotenv');

dotenv.config();

export const {
    DATABASE_URI,
    APP_URL
} = process.env;
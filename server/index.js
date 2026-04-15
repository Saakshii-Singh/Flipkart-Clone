import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import { v4 as uuid } from 'uuid';

import sequelize from './Connection/db.js';
import DefaultData from './default.js';
import Routes from './Routes/route.js';



const app = express();
const PORT = 8000;
import session from "express-session";

app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true only in HTTPS
}));
// 🔹 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 🔹 Routes
app.use('/', Routes);

// 🔹 DB Connection (MySQL)
sequelize.sync()
  .then(() => {
    console.log("MySQL Connected ✅");

    // Insert data only after DB connects
    if (process.env.NODE_ENV !== 'production') {
      DefaultData();
    }
  })
  .catch((error) => {
    console.log("DB Error ❌", error);
  });

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// 💳 Paytm Config
//export const paytmMerchantkey = process.env.PAYTM_MERCHANT_KEY;

// export const paytmParams = {
//   MID: process.env.PAYTM_MID,
//   WEBSITE: process.env.PAYTM_WEBSITE,
//   CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
//   INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
//   ORDER_ID: uuid(),
//   CUST_ID: process.env.PAYTM_CUST_ID,
//   TXN_AMOUNT: '100',
//   CALLBACK_URL: 'http://localhost:8000/callback',
//   EMAIL: 'test@gmail.com',
//   MOBILE_NO: '9999999999'
// };
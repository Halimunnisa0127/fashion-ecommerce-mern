// server.js
const express = require('express');
const app = express();
require("dotenv").config();

const helmet = require("helmet");
const connectDB = require('./src/Database/Db.js');
const corsOptions = require('./src/Components/CorsOptions/corsOptions.js');
const cors = require('cors');


// Routes
const AuthRoute = require('./src/Components/routes/auth.js');
const ProductRoute = require('./src/Components/routes/productRoutes.js');
const CartRoute = require('./src/Components/routes/cart.js');
const ProfileRoute = require('./src/Components/routes/profile.js');
const PaymentRoute = require('./src/Components/routes/payment.js');
const AdminRoute = require('./src/Admin/admin.js');
const OrderRoute = require('./src/Components/routes/order.js'); // Changed from order.js to orderRoutes.js

// Middleware
app.use(express.json());
app.use(cors(corsOptions));


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:"
      ]
    }
  })
);

// DB connect
connectDB();

// Routes
app.use('/api', AuthRoute);
app.use('/api/products', ProductRoute);
app.use('/api/cart', CartRoute);
app.use('/api', ProfileRoute);
app.use("/api/payment", PaymentRoute);
app.use('/api', AdminRoute);
app.use('/api/user', OrderRoute); // Orders will be at /api/user/orders, /api/user/order/:id

// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
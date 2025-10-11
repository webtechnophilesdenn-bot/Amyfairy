import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import session from "express-session";
import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import ProductRouter from "./routes/Product.Routes.js";
import BrandRouter from "./routes/Brand.Routes.js";
import CategoryRouter from "./routes/Category.Routes.js";
import UserRouter from "./routes/User.Routes.js";
import AuthRouter from "./routes/Auth.Routes.js";
import MailRouter from "./routes/Mail.Routes.js";
import CartRouter from "./routes/Cart.Routes.js";
import OrderRouter from "./routes/Order.Routes.js";
import PaymentRouter from "./routes/Payment.Routes.js";
import User from "./models/User.Model.js";
import {
  cookiesExtractor,
  isAuthenticated,
  sanitizeUser,
} from "./services/Common.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

/* ----------------------------- CORS settings ----------------------------- */
// allowlist me local + env wali CLIENT_URL. Deploy ke baad Amplify domain yahan add kar dena.
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman ya server-to-server calls (no origin) allow
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ----------------------------- Parsers & misc ---------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Frontend Amplify pe host hoga, isliye static serve ki zarurat nahi.
// Agar kabhi local build serve karna ho to niche wali line enable kar sakte ho:
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "build")));

/* ----------------------------- Auth/session ----------------------------- */
const opts = {
  jwtFromRequest: cookiesExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* --------------------------------- Routes -------------------------------- */
app.use("/products", isAuthenticated, ProductRouter);
app.use("/brands", isAuthenticated, BrandRouter);
app.use("/category", isAuthenticated, CategoryRouter);
app.use("/users", isAuthenticated, UserRouter);
app.use("/auth", AuthRouter);
app.use("/mail", MailRouter);
app.use("/cart", isAuthenticated, CartRouter);
app.use("/orders", isAuthenticated, OrderRouter);
app.use("/payment", isAuthenticated, PaymentRouter);

// Health checks (Elastic Beanstalk green status ke liye)
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

/* ---------------------------- Passport strategies ---------------------------- */
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) return done(err);
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          } else {
            const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET, {
              expiresIn: "24h",
            });

            return done(null, { id: user.id, role: user?.role, token });
          }
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user?.role,
    });
  });
});

/* --------------------------------- DB + App -------------------------------- */
connectDB();

// EB apna PORT env deta hai; local ke liye fallback 8080.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

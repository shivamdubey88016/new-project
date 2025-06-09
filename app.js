if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// ... rest of your requires ...


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsmate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require('./models/listing'); // Make sure this path is correct
const listingRoutes = require('./routes/listings.js');
const reviewRoutes = require('./routes/reviewRoute.js');
const userRoutes = require('./routes/user.js');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.use(express.json());
// View engine setup
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Mongoose connection
const mongoUrl = process.env.MONGO_ATLAS;
async function main() {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
main()
  .then(() => { console.log("connected to database"); })
  .catch(err => { console.log("Mongoose connection error:", err); });

// Session store setup
const store = MongoStore.create({
  mongoUrl,
  crypto: {
    secret: process.env.SECRET1,
  },
  touchAfter: 24 * 3600, // time period in seconds
});
store.on("error", function (e) {
  console.log("session store error", e);
});

// Session middleware
const sessionOption = {
  store: store,
  secret: process.env.SECRET2,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  },
};
app.use(session(sessionOption));
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and user locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Root route to prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.redirect('/listings');
});

// Stripe Payment Routes

// Checkout page
app.get('/checkout/:listingId', async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  res.render('checkout', {
    listing,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { price, listingId } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: `Listing #${listingId}`,
        },
        unit_amount: parseInt(price) * 100, // price in paise
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/success`,
    cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
  });
  res.redirect(303, session.url);
});

// Success and cancel routes
app.get('/success', (req, res) => {
  res.render('success');
});
app.get('/cancel', (req, res) => {
  res.render('cancel');
});

// Start server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});

//ai setup
// Add at the top with other requires


// OpenAI setup


// AI Suggestion Route
app.post('/ai/description', async (req, res) => {
  const { title } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for real estate listings." },
        { role: "user", content: `Suggest a catchy and detailed description for a property titled: "${title}"` }
      ],
      max_tokens: 100
    });
    const aiDescription = completion.data.choices[0].message.content.trim();
    res.json({ description: aiDescription });
  } catch (err) {
    res.status(500).json({ error: "AI suggestion failed." });
  }
});
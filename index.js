import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import postRoutes from './routes/posts.js';
import cors from "cors";
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import session from 'express-session';
const app = express();
const port =3000;
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(bodyParser.json()); // Parses JSON bodies
app.use(methodOverride('_method'));
app.use(express.static('public'));
// const cors = require('cors');
// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(cors());
app.use(bodyParser.json());

// In-memory store for reviews
let reviews = {};

// Route to get the current review
app.get('/review', (req, res) => {
    res.json(reviews);
});
app.get('/download-image', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'image.png');
    
    console.log('Requested file path:', filePath);  // Debugging

    if (fs.existsSync(filePath)) {
        console.log('File exists. Sending download.');  // Debugging
        res.download(filePath, 'downloaded_image.png', (err) => {
            if (err) {
                console.error('Error during file download:', err);
                res.status(500).send('Server error during file download');
            }
        });
    } else {
        console.error('File not found:', filePath);  // Debugging
        res.status(404).send('File not found');
    }
});


// Route to post a new review
app.post('/review', (req, res) => {
    const { userId, review } = req.body;
    if (userId && review) {
        reviews[userId] = review;
        res.status(200).json({ message: 'Review saved successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid request' });
    }
});

// Set EJS as the view engine
app.set('view engine', 'ejs');


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // You would save the user info to your database here
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/login', (req, res) => {
res.render("login.ejs");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Handle login logic here (e.g., check against database)
  res.send('Login successful');
  res.redirect('/posts');

  
});

// Routes
app.use('/posts', postRoutes);

// Home route
app.get('/posts', (req, res) => {
    res.redirect('/posts');
});
app.get("/",(req,res)=>{
res.render("home.ejs")    
});

// Start the server
app.listen(port, () => {
    console.log('Server is running on ');
});

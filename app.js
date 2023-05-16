const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const passport = require('passport');
const authRouter = require('./routes/authRoute')
const productRouter = require('./routes/productRoute')

// Load environment variables from a .env file
dotenv.config();
const app = express();


// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(logger('tiny'))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// database connection
mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, 
    useUnifiedTopology: true,
 })
  .then(() => {
    console.log('Connection to MongoDB is successful')
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server listening on port ${process.env.PORT || 3000}`)
    })
  })
  .catch((err) => console.log(err.message));

app.use(authRouter)
app.use(productRouter)

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Users").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);





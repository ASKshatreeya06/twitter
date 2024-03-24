const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userModel = require('./api/models/user_schema');
const postModel = require('./api/models/post_schema');
const protectRoute = require('./api/middleware/protect');
const api = require('./api/routes/routes');
const cors = require('cors');
const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up CORS options
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with the request
}));

require('./api/db/db');

app.use('/api/route', api);

app.listen(process.env.PORT, () => {
    console.log(`server started on http://localhost:${process.env.PORT}`);
});

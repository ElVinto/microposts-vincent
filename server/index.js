const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')



// connect to the local databqs

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// build the module posts
const posts = require('./routes/api/posts');
// connect the routes of posts to server_address:port/api/posts
app.use('/posts',posts);


// build 
var dataRouter = require('./routes/api/dbObservations');
app.use('/dbObservations', dataRouter);


// Heroku will use pross.env.PORT otherwise locqlly we use 5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports =app;




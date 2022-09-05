//connect to backend express API
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const dbconfig = require("./app/config/db.config");
const Role = db.role;
const path = require('path');

//connect to mongo db
db.mongoose
  .connect(`mongodb+srv://test:test123@mernproducts.pnxiv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
var corsOptions = {
  origin: ["http://localhost:8082", "http://localhost:3000", "http://10.0.0.24"]
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//server static assets
if(process.env.NODE_ENV === 'production'){
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req,res) =>{
    res.sendFile(pathe.resolve(__dirname,'client','build','index.html'));
  });
}

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);





// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to My e-commerce APP." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8082;
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
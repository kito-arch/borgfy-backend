const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const allRoutes = require("./routes/routes");
const session = require('express-session');
const port = process.env.PORT || 3000
const {session_secret} = require("./sessionSecret")

global.approot = __dirname;

app.use(express.static('public/images'));

const corsOptions ={
    origin: true, 
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,

 }

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))


app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/", allRoutes)


app.listen(port, ()=>{console.log("Surver is running on port 3000")});
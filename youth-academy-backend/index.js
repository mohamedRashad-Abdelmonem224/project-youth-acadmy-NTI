const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dbconnect = require("./config/dbconnect");
const routes = require("./routes/route");

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.urlencoded({ extended: true })); 


app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

const port = process.env.PORT || 3000;
 
const startServer = async () => {
    await dbconnect();
    app.listen(port, () => {
        console.log(`server run on port ${port}`);
    });
};

startServer();
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
//Import Routes
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
    console.log("DB connect successfully!")
);

// enable files upload
app.use(
    fileUpload({
        createParentPath: true
    })
);

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postsRoute);
app.use("/public", express.static(__dirname + "/uploads"));

app.listen(process.env.API_PORT, () => console.log("Server up and running..."));

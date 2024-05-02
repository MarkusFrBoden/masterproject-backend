const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

/* const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const catRouter = require("./routes/categories"); */
const dmaRouter = require("./routes/dmas");
const dmmRouter = require("./routes/dmms");
const userRouter = require("./routes/users");

const MONGO_URL = process.env.API_URI;
mongoose.connect(MONGO_URL)
    .then(() => console.log('database connection established'))
    .catch(err => console.log('error connecting', err))
    
app.use(cors());


// UPLOADING IMAGES TO THE SERVER
/* const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "images");
    }, filename: (req, res, cb) => {
        cb(null, req.body.name);
    }
})
const upload = multer({storage: storage});

app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("file has been uploaded");
})
app.use("/images", express.static(path.join(__dirname,"./images"))) */


// the api
app.use(express.json());
/* app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", catRouter); */
app.use("/api/users", userRouter);
app.use("/api/dmas", dmaRouter);
app.use("/api/dmms", dmmRouter);
app.use("/", (req, res) => {
    res.send('welcome to the server home page')
})
app.listen(process.env.PORT || 5000, () => {
    console.log('backend running')
})
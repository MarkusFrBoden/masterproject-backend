const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const dmaRouter = require("./routes/dmas");
const dmmRouter = require("./routes/dmms");
const userRouter = require("./routes/users");

const MONGO_URL = process.env.API_URI;
mongoose.connect(MONGO_URL)
    .then(() => console.log('database connection established'))
    .catch(err => console.log('error connecting', err))
app.use(cors());

// enable picture upload to backend file system
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const filename = req.file.filename;
    res.json({ filePath: `/uploads/${filename}` });
});

// use the defined apis
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/dmas", dmaRouter);
app.use("/api/dmms", dmmRouter);
app.use("/", (req, res) => {
    res.send('welcome to the server home page')
})
app.listen(process.env.PORT || 5000, () => {
    console.log('backend running')
})
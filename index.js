const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

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
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    const filename = req.file.filename;
    res.json({ filePath: `/uploads/${filename}` });
});

app.use("/uploads", express.static(path.join(__dirname,"./uploads")))

// use the defined apis
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", dmaRouter);
app.use("/api", dmmRouter);
app.use("/", (req, res) => {
    res.send('welcome to the server home page')
})
app.listen(process.env.PORT || 5000, () => {
    console.log('backend running')
})
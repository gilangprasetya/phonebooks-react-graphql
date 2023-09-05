var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const fileUpload = require('express-fileupload');
var { graphqlHTTP } = require('express-graphql')
const { schema, solution } = require('./graphql/phonebookSchema')

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/phonebookdb');
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: solution,
    graphiql: true,
}))

app.post(`/upload-avatar`, async (req, res) => {
    console.log(__dirname, "string");
    if (!req.files || !req.files.avatar) {
        return res.status(400).send("No avatar uploaded.");
    }

    const uploadedAvatar = req.files.avatar;
    const pictureName = `${Date.now()}-${uploadedAvatar.name}`;
    const uploadPath = `${__dirname}/public/images/${pictureName}`;

    uploadedAvatar.mv(uploadPath, (error) => {
        if (error) {
            console.error("Error uploading avatar:", error);
            return res.status(500).send("Error uploading avatar.");
        }

        const avatarUrl = `/public/images/${uploadedAvatar.name}`;

        res.send(pictureName);
    });
});

module.exports = app;

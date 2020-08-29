// eslint-disable-next-line no-unused-vars
const config = require('./utils/config');
const http = require('http');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const testRouter = require('./controllers/testFeatures')
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');



mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((err) => {
        logger.error('Problems establishing connection to MongoDB: ', err.message );
    });


app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
// endpoints and middlewarez
app.use(middleware.tokenExtractor);

app.use('/api/blogs',blogsRouter);
app.use('/api/users', usersRouter);
app.use('/login', loginRouter);

if (process.env.NODE_ENV === 'test'){
    app.use('/api/testing', testRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


module.exports = app;
// eslint-disable-next-line no-undef

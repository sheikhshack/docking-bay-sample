const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async(request, response) => {
    const {username, password} = request.body;

    // Queries DB for the existing user
    const user = await User.findOne({username: username});
    const passwordCheck = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);
    if (!(user && passwordCheck)){
        return response.status(401).json({error: 'Invalid username or password'});
    }
    // Creates token to be sent back to the caller
    const userForToken = {
        username: user.username,
        id: user._id // this is the Mongoose object...
    };

    const token = jwt.sign(userForToken, process.env.SECRET);
    // sends back 3 things -> token, username, and name
    response
        .status(200)
        .send({token, username: user.username, name: user.name});

});

module.exports = loginRouter;
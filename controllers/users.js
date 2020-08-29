const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url:1, title:1, author:1, id:1});
    response.json(users);
});

usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body;
    // Password validation
    if (!password || password.length < 3){
        return response.status(400).json({error:'password too short. Minimum length = 3'});
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = User({
        username,
        name,
        passwordHash
    });

    const savedUser = await newUser.save();
    response.json(savedUser);

});

module.exports = usersRouter;
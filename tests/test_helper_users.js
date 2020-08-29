const User = require('../models/user');


const initalUserList = [
    {
        username: 'atilla97',
        name: 'Atilla Hun',
        password: 'seesalt'
    },
    {
        username: 'genghis97',
        name: 'Genghis Khan',
        password: 'saltminew76'
    }
];
const userWithNonUnique =
    {
        username: 'atilla97',
        name: 'Atilla Hun',
        password: 'loremdolores'
    };

const userPassLengthFail =
    {
        username: 'hulagu97',
        name: 'Hulagu Khan',
        password: 'lo'
    };

const userNoPass =
    {
        username: 'amir97',
        name: 'Amir Timur'
    };
const userNameLengthFail = {
    username: 'am',
    name: 'Amir Timur',
    password: '4234235235'
};

const userNoUsername = {
    name: 'Amir Timur',
    password: '4234235235'
};

const usersInDB = async() => {
    const users = await User.find({});
    return users.map(blog => blog.toJSON());
};



module.exports = {initalUserList, userNameLengthFail, userNoPass, userPassLengthFail, userWithNonUnique, userNoUsername, usersInDB};
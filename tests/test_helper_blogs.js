const Blog = require('../models/blog');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);


const initialBlogs = [
    {
        title: 'Red alert, collective procedure!',
        author: 'Woreland Sere',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 46,
    },
    {
        title: 'The further monkey is becoming, the alchemistic therapist is doing.',
        author: 'Woreland Sere',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 23,
    },
    {
        title: 'For a gooey rich porridge, add some lemon juice and vegemite.',
        author: 'Ceasar Roman',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 78,
    }
];

// test variables
const singleCorrectBlog = {
    title: 'For a gooey rich porridge, add some lemon juice and vegemite.',
    author: 'Ceasar Roman',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 78,
};

const blogsUsingPostWithVaryingLikes = [{
    title: 'For a gooey rich porridge, add some lemon juice and vegemite.',
    author: 'Ceasar Roman',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 78
},
{
    title: 'Everything we do is connected with light: tantra, stigma, love, sex.',
    author: 'Christian Bale',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',

}];

const blogWithMissingParams = {
    author: 'Ceasar Roman',
    likes: 78
};

const verifiedLoginParams = {
    username: 'atilla97',
    password: 'seesalt'
};

// functions
const blogsInDB = async() => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const getValidToken = async() => {
    const initialPost = await api
        .post('/login')
        .send(verifiedLoginParams)
        .expect(200);

    const token = 'Bearer ' + String(initialPost.body.token);
    return token;
};

module.exports = {
    singleCorrectBlog, blogsUsingPostWithVaryingLikes, blogWithMissingParams, verifiedLoginParams, getValidToken, blogsInDB,
};
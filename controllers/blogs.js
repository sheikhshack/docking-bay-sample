const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Token retrieval function
// const getTokenFrom = request => {
//     const authorization = request.get('authorization');
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         return authorization.substring(7);
//     }
//     return null;
// };


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1});
    response.json(blogs);

});

// Singular retrieval, for testing purposes
blogsRouter.get('/:id', async(request, response) => {
    const id = String(request.params.id);
    const blogByID = await Blog.findById(id);
    response.json(blogByID);
});

blogsRouter.post('/', async (request, response) => {
    const {title, author, url, likes} = request.body;
    const token = request.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.id;
    if (!token || !userId) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(userId);
    // _id is an object from Mongo. Not the string one that we spit out
    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id
    });
    const savedBlog = await blog.save();
    // adjust the user side as well
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);

});

blogsRouter.delete('/:id', async(request, response) => {

    const id = String(request.params.id);
    // check if user is authorised to do this

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const userId = decodedToken.id.toString();

    const blogPost = await Blog.findById(id);

    if (blogPost.user._id.toString() === userId){
        await Blog.findByIdAndDelete(id);
        response.status(204).end();
    }
    else {
        response.status(401).json({ error: 'Unauthorized/Illegal operation' });
    }

});

blogsRouter.put('/:id', async(request, response) => {
    const id = String(request.params.id);
    const blog = {
        likes: request.body.likes
    };
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {new: true});
    response.json(updatedBlog);
});


module.exports = blogsRouter;
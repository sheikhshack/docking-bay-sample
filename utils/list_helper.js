const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
    return blogs.length === 0? 0: blogs.map(blog => blog.likes).reduce((like, blog) => like + blog);
};

const favoriteBlog = (blogs) => {
    // I will reduce this into 2 objects per iteration. If previous's like > current.likes, i will return previous.
    // If for some reason no blogs, i will fallback to returning 0
    if (blogs.length === 0) {return null;}
    const result =  blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current);
    return result;
};

const mostBlogs = (blogs) => {

    if (blogs.length === 0) {return null;}

    const grouped = _.groupBy(blogs, (blog) => {
        return blog.author;
    });
    const talliedBlogs= _.map(grouped, (perAuthor) => {
        return {
            author: perAuthor[0].author,
            blogs: perAuthor.length
        };
    });
    return(talliedBlogs.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current));
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) {return null;}

    const grouped = _.groupBy(blogs, (blog) => {
        return blog.author;
    });
    const talliedLikes = _.map(grouped, (perAuthor) => {
        return {
            author: perAuthor[0].author,
            likes: totalLikes(perAuthor)
        };
    });
    return(talliedLikes.reduce((prev, current) => (prev.likes > current.likes) ? prev : current));
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
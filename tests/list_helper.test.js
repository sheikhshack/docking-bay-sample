const listHelper = require('../utils/list_helper');

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
];
const listWithManyBlog = [
    {
        _id: '4354645645645',
        title: 'Go To 576564 Considered Harmful',
        author: 'Edger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '475675674567567547',
        title: 'Go To 754675647 Considered Harmful',
        author: 'Edsger W. 757547',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 23,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 0,
        __v: 0
    }
];

const mostLiked = {
    _id: '475675674567567547',
    title: 'Go To 754675647 Considered Harmful',
    author: 'Edsger W. 757547',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 23,
    __v: 0
};

const listWithNoBlog = [];

test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
});

describe('total likes', () => {


    // Start of test suite
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        expect(result).toBe(5);
    });
    
    test('when there is multiple blogs', () => {
        const result = listHelper.totalLikes((listWithManyBlog));
        expect(result).toBe(28);
    });

    test('when there is 0 blogs', () => {
        const result = listHelper.totalLikes((listWithNoBlog));
        expect(result).toBe(0);
    });
});
describe('favourite blog test', () => {

    test('when there is 0 blogs', () => {
        const result = listHelper.favoriteBlog((listWithNoBlog));
        expect(result).toEqual(null);
    });

    test('when there is many blogs', () => {
        const result = listHelper.favoriteBlog((listWithManyBlog));
        expect(result).toEqual(mostLiked);
    });

    test('when there is one blogs', () => {
        const result = listHelper.favoriteBlog((listWithOneBlog));
        expect(result).toEqual(listWithOneBlog[0]);
    });

});
describe('most blogged author test', () => {
    test ('when there is 0 blog', () => {
        const result = listHelper.mostBlogs(listWithNoBlog);
        expect(result).toBe(null);
    });

    test ('when there is only 1 blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog);
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        });
    });

    test('when there is 2 blogs, 1 author', () => {
        const result = listHelper.mostBlogs(listWithManyBlog);
        expect(result).toEqual({
            author: 'Edger W. Dijkstra',
            blogs:2
        });
    });

});

describe('most liked author test', () => {

    test ('when there is 0 blog', () => {
        const result = listHelper.mostLikes(listWithNoBlog);
        expect(result).toBe(null);
    });

    test ('when there is only 1 blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog);
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        });
    });
    test('when there is 2 blogs, 1 author', () => {
        const result = listHelper.mostLikes(listWithManyBlog);
        expect(result).toEqual({
            author: 'Edsger W. 757547',
            likes: 23
        });
    });

});
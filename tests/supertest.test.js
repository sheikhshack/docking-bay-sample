const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const bloghelper = require('./test_helper_blogs');
const userhelper = require('./test_helper_users');


const api = supertest(app);

beforeEach(async() => {
    // Wipes the collection first
    await Blog.deleteMany({});
    // Teardown users, add inital entries
    await User.deleteMany({});

    const promiseArray = userhelper.initalUserList.map(user => {
        return api.post('/api/users').send(user);
    });
    await Promise.all(promiseArray);
});

describe('These set of tests would test the fucntionality of the blog api', () => {
    // No changes
    test('Makes a get request for all blogs', async()=> {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

    });
    // No changes
    test('verifies the unique identifier property of id', async () => {
        const blogpostSample = new Blog(bloghelper.singleCorrectBlog);
        await blogpostSample.save();

        // does a read now
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);


        response.body.map(posts => {
            console.log(posts);
            let result = posts.id;
            expect(result).toBeDefined();
        });

    });
    // Changed: Added authorisation
    test('Verify that HTTP post method working correctly, with authentication' , async () => {
        // Verifies the authentication first


        const initialLength = 0;
        const token = await bloghelper.getValidToken();

        await api.post('/api/blogs')
            .set('Authorization', token ) // Works.
            .send(bloghelper.singleCorrectBlog)
            .expect(201);

        const resultingBlogs = await bloghelper.blogsInDB();
        expect(resultingBlogs).toHaveLength(initialLength + 1);
        expect(resultingBlogs[0].id).toBeDefined();
        expect(resultingBlogs[0].author).toContain(bloghelper.singleCorrectBlog.author);

    });

    // No changes
    test('Verify that new likes feature with no likes property', async () => {

        //save this blogs accordingly first
        const blogObjects = bloghelper.blogsUsingPostWithVaryingLikes.map(blog => new Blog(blog));
        const promiseArray = blogObjects.map(note => note.save());
        await Promise.all(promiseArray);

        // gets them back
        const blogsInDB = await Blog.find({});
        console.log('result: ', blogsInDB);
        blogsInDB.map(posts => {
            console.log(posts);
            expect(posts.likes).toBeDefined();
            // I acknowledge that this is a bad method, but I wanted 2 different test cases to be inside
            expect(posts.likes === 0 || posts.likes === 78).toBeTruthy();
        });


    });
    // Changed: added authentication
    test('Verify that title and URLs missing will give 400 Bad Request', async () => {
        const token = await bloghelper.getValidToken();


        await api.post('/api/blogs')
            .set('Authorization', token )
            .send(bloghelper.blogWithMissingParams)
            .expect(400);
    });
    test('Verify that HTTP delete post method working correctly, with authentication' , async () => {
        // Verifies the authentication first
        const token = await bloghelper.getValidToken();
        const initialLength =0;


        const postingBlog = await api.post('/api/blogs')
            .set('Authorization', token ) // Works.
            .send(bloghelper.singleCorrectBlog)
            .expect(201);

        await api.delete(`/api/blogs/${postingBlog.body.id}`)
            .set('Authorization', token)
            .expect(204);

        const resultingBlogs = await bloghelper.blogsInDB();
        expect(resultingBlogs).toHaveLength(initialLength);

    });

    test('Verify that authentication protocol negative cases (invalid + no token) give right error', async () => {
        const token = 'Bearer thistokenismadeup';
        const postingBlog = await api.post('/api/blogs')
            .set('Authorization', token)
            .send(bloghelper.singleCorrectBlog)
            .expect(401);

        const noToken = await api.post('/api/blogs')
            .send(bloghelper.singleCorrectBlog)
            .expect(401);

        expect(postingBlog.body.error).toBe('invalid token');
        expect(noToken.body.error).toBe('invalid token');



    });

});

describe('These set of tests will test the user api for setup side of things', () => {

    test('Verify that duplicate usernames are rejected', async () => {

        const response = await api
            .post('/api/users')
            .send(userhelper.userWithNonUnique)
            .expect(400);

        expect(response.body.error).toContain('Error, expected `username` to be unique');

    });
    test('Verify that minlength/required password is working', async () => {

        const response1 = await api
            .post('/api/users')
            .send(userhelper.userNoPass)
            .expect(400);
        const response2 = await api
            .post('/api/users')
            .send(userhelper.userPassLengthFail)
            .expect(400);

        expect(response1.body.error).toBe('password too short. Minimum length = 3');
        expect(response2.body.error).toBe('password too short. Minimum length = 3');


    });
    test('Verify that minlength/required username is working', async () => {

        const response1 = await api
            .post('/api/users')
            .send(userhelper.userNameLengthFail)
            .expect(400);

        const response2 = await api
            .post('/api/users')
            .send(userhelper.userNoUsername)
            .expect(400);

        expect(response1.body.error).toContain(`Path \`username\` (\`${userhelper.userNameLengthFail.username}\`) is shorter than the minimum allowed length (3)`);
        expect(response2.body.error).toContain('Path `username` is required.');



    });
});


afterAll(() => {
    mongoose.connection.close();
});
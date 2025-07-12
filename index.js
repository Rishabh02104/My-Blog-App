// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path'); // <<< ADD THIS LINE

// Initialize Express app
const app = express();
const port = 3000;

// Array to store blog posts (in-memory, not persistent)
let posts = [];
let postIdCounter = 0; // Simple counter for unique IDs

// Configure EJS as the view engine
app.set('view engine', 'ejs');
// <<< ADD THIS LINE to explicitly set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use body-parser middleware to parse URL-encoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

// --- Routes ---

// GET / - Home page: Displays all posts
app.get('/', (req, res) => {
    res.render('home', { posts: posts });
});

// GET /compose - Page to create a new post
app.get('/compose', (req, res) => {
    res.render('compose');
});

// POST /compose - Handles new post submission
app.post('/compose', (req, res) => {
    const newPost = {
        id: ++postIdCounter, // Assign a unique ID
        title: req.body.postTitle,
        content: req.body.postContent
    };
    posts.push(newPost); // Add the new post to the array
    res.redirect('/'); // Redirect back to the home page
});

// GET /posts/:id - Displays a single post
app.get('/posts/:id', (req, res) => {
    const requestedPostId = parseInt(req.params.id); // Convert ID from string to integer
    const post = posts.find(p => p.id === requestedPostId); // Find the post by ID

    if (post) {
        res.render('post', { post: post });
    } else {
        res.status(404).send('Post not found'); // Handle case where post is not found
    }
});


// GET /edit/:id - Page to edit an existing post
app.get('/edit/:id', (req, res) => {
    const requestedPostId = parseInt(req.params.id);
    const postToEdit = posts.find(p => p.id === requestedPostId);

    if (postToEdit) {
        res.render('edit', { post: postToEdit });
    } else {
        res.status(404).send('Post not found for editing');
    }
});

// POST /edit/:id - Handles post update submission
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const updatedTitle = req.body.postTitle;
    const updatedContent = req.body.postContent;

    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        posts[postIndex].title = updatedTitle;
        posts[postIndex].content = updatedContent;
        res.redirect('/'); // Redirect to home after update
    } else {
        res.status(404).send('Post not found for update');
    }
});

// POST /delete/:id - Handles post deletion
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Filter out the post with the matching ID
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== postId);

    if (posts.length < initialLength) {
        res.redirect('/'); // Redirect to home after successful deletion
    } else {
        res.status(404).send('Post not found for deletion');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Blog Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

// Routes

// Index Route
app.get('/', async (req, res) => {
  const posts = await Post.find();
  res.render('index', { posts });
});

// New Post Route
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// Create Post Route
app.post('/posts', async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.redirect('/');
});

// Show Post Route
app.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('show', { post });
});

// Edit Post Route
app.get('/posts/:id/edit', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('edit', { post });
});

// Update Post Route
app.put('/posts/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/${req.params.id}`);
});

// Delete Post Route
app.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start Server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

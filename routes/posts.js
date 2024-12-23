// routes/posts.js

import { Router } from 'express';
import Post from '../models/post.js';

const router = Router();

// Index - Show all posts
router.get('/', (req, res) => {
    try {
        const posts = Post.findAll();
        res.render('index', { posts });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});



// New - Form to create new post
router.get('/new', (req, res) => {
    res.render('new');
});

// Create - Add new post to DB
router.post('/', (req, res) => {
    try {
        const { title, content } = req.body;
        Post.create({ title, content });
        res.redirect('/posts');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Edit - Show form to edit a post
router.get('/:id/edit', (req, res) => {
    try {
        const post = Post.findById(req.params.id);
        if (post) {
            res.render('edit', { post });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Update - Update the post
router.put('/:id', (req, res) => {
    try {
        const updatedPost = Post.update(req.params.id, req.body);
        if (updatedPost) {
            res.redirect('/posts');
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Delete - Remove post from DB
router.delete('/:id', (req, res) => {
    try {
        const success = Post.delete(req.params.id);
        if (success) {
            res.redirect('/posts');
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;

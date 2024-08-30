const express = require('express');
const router = express.Router();
const Post = require('../../models/Comments');
const Comment = require('../../models/Comments');


router.post('/', (req, res) => {
   
    Post.findOne({_id: req.body.id}).then(post => {
      
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body
        });

        post.comments.push(newComment);

        post.save().then(savedPost => {
          
            newComment.save().then(savedComment => {
                res.redirect(`/post/${post.id}`);
          
            });
        });
    });
});
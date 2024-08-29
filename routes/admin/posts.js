const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
//const select = require('../../helpers/handlebars-helpers');
const { isEmpty } = require('../../helpers/upload-helper');
//const flash = require('connect-flash');





router.all('/posts/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
}); 

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        res.render('admin/posts', {posts: posts});
    });
   // res.send('IT WORKS');
});

router.get('/create', (req, res) => {
   res.render('admin/posts/create');
});


let filename = '';

router.post('/create', (req, res) => {
 let errors = [];

 if(!req.body.title){
    errors.push({message: 'please add a title'});
 }
 
 if(!req.body.status){
    errors.push({message: 'please add a title'});
 }

 if(!req.body.body){
    errors.push({message: 'please add a description'})
 }

 if(errors.length > 0){
    res.render('admin/posts/create', {
        errors: errors
    });
 } else {


    if(!isEmpty(req.files)){
       let file = req.files.file;
        filename = Date.now() + '-' + file.name;
       
       let dirUploads = './public/uploads/';
   
       file.mv(dirUploads + filename, (err) => {
           if(err) throw err;
       });
   
       console.log('is not empty');
       }else{
           console.log('Is Empty');
       }
       
           
   
        let allowComments = true;
   
        if(req.body.allowComments){
           allowComments = true;
        }else {
           allowComments = false;
        }
   
       const newPost = new Post({
           title: req.body.title,
           status: req.body.status,
           allowComments: req.body.allowComments ? true : false,
           body: req.body.body,
           file: filename
       });
   
       newPost.save().then(savedPost => {
           console.log(savedPost);
           req.flash('success_message', 'Post was Created successfully');
           res.redirect('/admin/posts');
       }).catch(error => {
            console.log(error);
       });   

 }
 
    
});

// router.get('/posts/edit', (req, res) => {
    
//     res.render();
// });


router.get('/edit/:id', (req, res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        res.render('admin/posts/edit', {post: post});
        
    });

   // res.render('admin/posts/edit');
})


router.put('/edit/:id', (req, res) => {
   // res.send('It works');

    Post.findOne({_id: req.params.id}).then(post => {
      if(req.body.allowComments){
        allowComments = true;
      }else {
        allowComments = false;
      }  

      post.title = req.body.title;
      post.status = req.body.status;
      post.allowComments = allowComments;
      post.body = req.body.body;
    
      if(!isEmpty(req.files)){
        let file = req.files.file;
         filename = Date.now() + '-' + file.name;
         post.file = filename;
         
        let dirUploads = './public/uploads/';
    
        file.mv(dirUploads + filename, (err) => {
            if(err) throw err;
        });
            
        console.log('is not empty');
    }else{
        console.log('Is Empty');
    }
    
    
    
    post.save().then(updatedPost => {
           req.flash('success_message', 'Post was successfully deleted');
          res.redirect('/admin/posts');
       });
    
    });
});

router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete({ _id: req.params.id}).then(result => {
      
        fs.unlink(uploadDir + result.file, (err) => {
              result.deleteOne();

              req.flash('success_message', 'Post was successfully deleted');
              res.redirect('/admin/posts');
              console.log(err);  
            
        });      


    });
});

module.exports = router;














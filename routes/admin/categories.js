const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
}); 

router.get('/', (req, res) => {
   Category.find({}).then(Categories => {
      res.render('/admin/categories/index', {Categories: Categories});
   });
});


router.post('/create', (req, res) => {
   const newCategory = new Category({
      name: req.body.name
   });

   newCategory.save(savedCategory => {
      res.redirect('/admin/categories');
   });
});


router.get('/edit/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).then(category => {
        res.render('/admin/categories/edit', {category: category});
    });
});



router.post('/edit/:id', (req, res) => {
    Category.findOne({_id: req.params.id }).then(category => {
        
        category.name = req.body.name;

        category.save().then(updatedCategory => {
            console.log(updatedCategory);
            res.redirect('/admin/categories');        })
    });
   

});


router.delete('/:id', (req, res) => {
   Category.findByIdAndDelete({_id: req.body.id}).then(category => {
      res.redirect('/admin/categories');
   })
});

router.post


module.exports = router;
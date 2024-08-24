const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('admin/index');
});

// admin/Dashboard
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
})

module.exports = router;
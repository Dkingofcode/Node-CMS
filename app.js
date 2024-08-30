const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); 
const Handlebars= require('handlebars');
const bodyParser = require('body-parser');
const Upload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const { mongoUrl } = require("./config/database")
const passport = require('passport');



const { allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

// Body Parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Flash messages
app.use(flash());

// Upload middleware
app.use(Upload());

// Method Override
app.use(methodOverride('_method'));

// apply sessions
app.use(session({
    secret: 'password',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());

// local Variables using middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
   res.locals.error = req.flash('error');
    next();
});



mongoose.connect('mongodb://localhost:27017/cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => {
    console.log('MONGO CONNECTED');
}).catch(err => console.log(err));


app.use(express.static(path.join(__dirname, 'public')));

//  Set View Engine
const {select, GenerateTime} = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphbs.engine({handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'Home', helpers: {select: select, generateTime: GenerateTime} }));
app.set('view engine', 'handlebars');


//  Load Routes

const home = require('./routes/home/main');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');

// Use Routes

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);


app.listen(5400, () => {
    console.log(`listening on port 5400`);
});
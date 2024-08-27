const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); 
const Handlebars= require('handlebars');
const bodyParser = require('body-parser');


const { allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

// Body Parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


// Method Override
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => {
    console.log('MONGO CONNECTED');
}).catch(err => console.log(err));


app.use(express.static(path.join(__dirname, 'public')));

//  Set View Engine

app.engine('handlebars', exphbs.engine({handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'Home' }));
app.set('view engine', 'handlebars');


//  Load Routes

const home = require('./routes/home/main');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

// Use Routes

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);



app.listen(5400, () => {
    console.log(`listening on port 5400`);
});
const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => {
    console.log('MONGO CONNECTED');
}).catch(err => console.log(err));


app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'home' }));
app.set('view engine', 'handlebars');

const home = require('./routes/home/main');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');


app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);



app.listen(5400, () => {
    console.log(`listening on port 5400`);
});
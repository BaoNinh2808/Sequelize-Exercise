// cofig to use express
const express = require('express');
const app = express();
const port = process.env.port || 3000;

// config to use handlebars
const expressHbs = require('express-handlebars');
// config to use pagination
const { createPagination } = require('express-handlebars-paginate');

// set static folder is html
app.use(express.static(__dirname + '/html'));

// set view engine
app.engine(
    'hbs',
    expressHbs.engine(
        {
            extname: 'hbs',
            defaultLayout: "layout",
            layoutsDir: __dirname + '/views/layouts/',
            partialsDir: __dirname + '/views/partials/',
            runtimeOptions: {   //to use default value for properties
                allowProtoPropertiesByDefault: true
            },
            helpers: { //to use pagination
                createPagination: createPagination
            }

        }
    )
)
app.set('view engine', 'hbs');

//create table by code
// app.get('/create-table', (req, res) => {
//     const models = require('./models');
//     models.sequelize.sync().then(() => {
//         res.send('table created');
//     });
// });

app.get('/', (req, res) => {
    //call to app use /blog
    res.redirect('/blogs');
});
app.use('/blogs', require('./routes/blogRoute'));

//404 page
app.use((req, res, next) =>{
    res.status(404).render('error',{message : 'File not found!'});
})

//500 error
app.use((err, req, res, next) =>{
    console.log(err);
    res.status(500).render('error',{message : 'Server error!'});
})

//Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

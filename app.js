let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let registerRouter = require('./routes/register');
let mainRouter = require('./routes/main');
let loginRouter = require('./routes/login');
let graphRouter = require('./routes/graph');
let processStructuresRouter = require('./routes/processStructures');
let activeProcessesRouter = require('./routes/activeProcesses');
let sankeyRouter = require('./routes/sankey');

let app = express();

//Setting up schemas
mongoose.connect('mongodb://localhost:27017/Aguda',{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
let PS = require("./schemas/ProcessStructure");
let UAR = require("./schemas/UsersAndRole");
let U = require("./schemas/User");


// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/main',mainRouter);
app.use('/login',loginRouter);
app.use('/graph',graphRouter);
app.use('/processStructures', processStructuresRouter);
app.use('/activeProcesses', activeProcessesRouter);
app.use('/sankey',sankeyRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;

var express         =   require("express"),
    mongoose        =   require("mongoose"),
    passport        =   require("passport"),
    LocalStrategy   =   require("passport-local"),
    bodyParser      =   require("body-parser"),
    User            =   require("./models/user"),
    flash           =   require("connect-flash"),
    nodemailer      =   require("nodemailer");
    
var app             =   express();

var transporter;

// nodemailer.createTestAccount((err, account) => {

//     transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: account.user, // generated ethereal user
//             pass: account.pass  // generated ethereal password
//         }
//     });
// });

// Connect to MongoDB
mongoose.connect("mongodb://localhost/apollo",{
    useMongoClient: true
});

// Set Up view parameters and static dir path
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// Configure Passport
app.use(require("express-session")({
    secret: "Apollo Users",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.use(function(req,res,next){
//     res.locals.currentUser = req.user;
//     // res.locals.error = req.flash("error");
//     // res.locals.success = req.flash("success");
//     next();
// });


// Create admin for the first time
var Admin = new User({
        name: {first: 'admin', last: 'admin'},
        email: 'admin@apollomail.com',
        isAdmin: true
    });
    
var query = {
        $or: [{email: Admin.email},{isAdmin: Admin.isAdmin}]
    };


var password = 'admin@apollomail';
    // console.log('I am here');
User.findOne(query, function (err, user) {
    if(user){
        // console.log(user);
        console.log('Admin already present!');
    }
    else{
        console.log('Hi');
        User.register(Admin, password, function(err, user){
            if(err){
                console.log(err);
            }
            else{
                User.verifyEmail(user.authToken, function(err, existingAuthToken){
                    
                });   
            }
        });
    }
});



// Routes - GET
app.get('/register',function(req, res){
    res.render('register');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/welcome', function(req, res) {
    res.render('welcome');
});


app.get('*', function(req, res){
    res.render('register');
});

app.post("/register",function(req, res){
    var newUser = new User({
        name: req.body.firstname + ' ' + req.body.lastname,
        email: req.body.email
    });
    console.log(newUser);
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log("error");
            res.render("register");
        }
        // var authenticationURL = 'http://localhost:3000/verify?authToken=' + user.authToken;
        // var mailOptions = {
        //     from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
        //     to: 'goyal.yashendra@gmail.com', // list of receivers
        //     subject: 'Welcome ✔', // Subject line
        //     text: 'Welcome to ApolloMail', // plain text body
        //     html: '<a target=_blank href=\"' + authenticationURL + '\">Please Confirm your email to enjoy uninterrupted service.</a>' // html body
        // };

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         return console.log(error);
        //     }
        //     console.log('Message sent: %s', info.messageId);
        //     // Preview only available when sending through an Ethereal account
        //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        // });
        res.redirect('/welcome');
    });
});

app.post('/login', passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/welcome');
});

// Start Server
app.listen(3000, function(){
    console.log('Server Started!!!');
});

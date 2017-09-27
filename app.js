var express         =   require("express"),
    mongoose        =   require("mongoose"),
    passport        =   require("passport"),
    LocalStrategy   =   require("passport-local"),
    bodyParser      =   require("body-parser"),
    User            =   require("./models/user"),
    mailer          =   require("express-mailer");
    
var app             =   express();

mailer.extend(app, {
    from: 'no-reply@apollomail.com',
    host: 'smtp.gmail.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
        user: 'goyal.yashendra@gmail.com',
        pass: 'Yash@1234'
    }
});

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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
        email: req.body.username
    });
    console.log(newUser);
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log("error");
            res.render("register");
        }
        app.mailer.send('email', {
            to: 'yashegoy@in.ibm.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
            subject: 'Test Email', // REQUIRED. 
            //otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
            }, function (err) {
                if (err) {
                    // handle error 
                    console.log(err);
                    res.send('There was an error sending the email');
                    return;
                }
            res.send('Email Sent');
        });
    });
});

app.post('/login', passport.authenticate("local",{successRedirect: "/welcome", failureRedirect: "/login"}),function(req, res){
    
});

// Start Server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server Started!!!');
});
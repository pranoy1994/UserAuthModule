var express         =   require("express"),
    mongoose        =   require("mongoose"),
    passport        =   require("passport"),
    LocalStrategy   =   require("passport-local").Strategy,
    bodyParser      =   require("body-parser"),
    User            =   require("./models/user"),
    flash           =   require("connect-flash");
    
var app             =   express();
var indexRoutes     =   require("./routes/index");


// Connect to MongoDB
mongoose.connect("mongodb://localhost/apollo",{
    useMongoClient: true
});

// mongoose.connect("mongodb://ygoyal:987456321@ds135537.mlab.com:35537/apollo");

// Set Up view parameters and static dir path
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());


// Configure Passport
app.use(require("express-session")({
    secret: "Apollo Users",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// passport.use('local-login', new LocalStrategy({
// 		passReqToCallback: true
// 		},
// 		function(req, username, password, done){
// 			process.nextTick(function(){
// 				User.findOne({ 'email': username}, function(err, user){
// 					if(err)
// 						return done(err);
// 					if(!user)
// 						return done(null, false, req.flash('loginMessage', 'No User found'));
// 					if (!user.verifyPassword(password)) { return done(null, false); }
// 					return done(null, user);

// 				});
// 			});
// 		}
// ));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Create Admin if not already present
var Admin = new User({
        name: 'admin',
        email: 'admin@apollomail.com',
        isAdmin: true
    });
    
var query = {
        $or: [{email: Admin.email},{isAdmin: Admin.isAdmin}]
    };


var password = 'admin@apollomail';
    // console.log('I am here');
User.findOne(query, function (err, user) {
    if(err){
        console.log(err);
    }
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

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);


// Start Server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server Started!!!');
});
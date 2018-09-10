var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// var transporter;
// nodemailer.createTestAccount((err, account) => {
//     if (err) {
//         console.error('Failed to create a testing account');
//         console.error(err);
//     }
//     // create reusable transporter object using the default SMTP transport
//     transporter = nodemailer.createTransport({
//         host: account.smtp.host,
//         port: account.smtp.port,
//         secure: account.smtp.secure, // true for 465, false for other ports
//         auth: {
//             user: account.user, // generated ethereal user
//             pass: account.pass  // generated ethereal password
//         }
//     });
// });



router.get("/register", function (req, res) {
    res.render("register");
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/welcome', function (req, res) {
    if (req.isAuthenticated()) {
        // console.log(req.user);
        // if(req.user !== undefined){
        if (req.user.isAdmin) {
            User.find({ isAdmin: false }, function (err, allUsers) {
                if (err)
                    console.log("error");
                else
                    res.render("admin_page", { users: allUsers });
            });
        }
        else
            res.render('welcome', { user: req.user });
    }
    else
        res.redirect('/login');
    // res.send('Hi');
    // }
    // else{
    //     res.send('Hi');
    // }
});

router.get('/verify', function (req, res) {
    console.log(('I am here!!'));
    User.verifyEmail(req.query.authToken, function (err, existingAuthToken) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/welcome');
        }
    });
});

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
});

router.get('*', function (req, res) {
    res.render('register');
});

// app.get('/verify/:authToken',function(req, res) {
//     User.find();
// });


router.post("/register", function (req, res) {
    var newUser = new User({
        name: req.body.firstname + ' ' + req.body.lastname,
        email: req.body.email
    });
    console.log(newUser);
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            // res.status(409).send({code:0, message:'user already registered'});
            req.flash("error", err.message);
            res.redirect('/register');
        }
        else {
            // if(user.email == admin_email){
            //     User.find({}, function(err, allUsers){
            //     if(err)
            //         console.log("error");
            //     else
            //         res.render("admin_page", {users: allUsers});
            //     });
            // }
            // else
            res.render('welcome', { user: user });
        }
    });
    // setup email data with unicode symbols
    // let mailOptions = {
    //     from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    //     to: 'goyal.yashendra@gmail.com', // list of receivers
    //     subject: 'Hello ✔', // Subject line
    //     text: 'Hello world?', // plain text body
    //     html: '<b>Hello world?</b>' // html body
    // };

    // // send mail with defined transport object
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
});

const path = require('path');
router.post('/login', passport.authenticate("local", { successRedirect: '/welcome', failureRedirect: '/login', failureFlash: true }));
var pdf = require('html-pdf');
router.post('/upload', (req, res) => {
    const subject = req.body.subject;
    const body = req.body.body;
    const date = req.body.date;
    console.log(req.body);


    var html = '<html><body><h1><center>' + subject + '</center></h1></body><br><br><br><p>'+body+'</p></html>';
    var options = { format: 'Letter' };
    const fileName = Date.now() + '.pdf';
    const uploadPath = path.join(__dirname, '..', 'public', 'files', fileName);
    pdf.create(html, options).toFile(uploadPath, function (err, response) {
        if (err) return console.log(err);
        console.log(response);
        res.send({
            code: 1,
            path: 'http://apollo.qleverlabs.in/files/' + fileName
        })

    });
})

module.exports = router;
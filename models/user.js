var mongoose                =   require("mongoose"),
//    passportLocalMongoose   =   require("passport-local-mongoose");
    passportLocalMongooseEmail  =   require("passport-local-mongoose-email");
    
var UserSchema  =   new mongoose.Schema({
    name: String,
    password: String,
    email: String
});

UserSchema.plugin(passportLocalMongooseEmail,{
    usernameField : 'email',
});
module.exports  =   mongoose.model('User', UserSchema);
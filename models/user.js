var mongoose                =   require("mongoose"),
//    passportLocalMongoose   =   require("passport-local-mongoose");
    passportLocalMongooseEmail  =   require("passport-local-mongoose-email");
    
var UserSchema  =   new mongoose.Schema({
    name: String,
    password: String,
    email: { type: String, unique: true, lowercase: true, required: true },
    isAdmin: { type: Boolean, default: false, required: true }
});

UserSchema.plugin(passportLocalMongooseEmail,{
    usernameField : 'email',
});
module.exports  =   mongoose.model('User', UserSchema);

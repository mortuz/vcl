var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);

var UserSchema = new Schema({
  // id
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  company_name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  created: { type: Date, default: Date.now },
  active_token: { type: String },
  recovery_token: { type: String },
  blocked_by_admin: { type: Boolean, default: false },
  password: { type: String, required: true }
});

UserSchema.pre("save", function(next) {
  var user = this;
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);

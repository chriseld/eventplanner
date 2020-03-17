// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    name:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    // The password cannot be null and is a minimun of 8 characters
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          len: {
           args: [[1,8]],
           msg: "Please enter at least 8 characters"
          }
    },
    
    interest: {
        type: DataTypes.STRING,
        default: "Sports"

    }
    }

});


  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  // associate a user with several events
  User.associate = function(models) {
    User.hasMany(models.Events,{
      foreignKey:{
        allowNull: false
      }
    })
    
  }
  // associate a user with an admin
  User.associate = function(models) {
    User.belongsTo(models.Admin,{
      foreignKey: {
        allowNull: false
      }
    })
  }
  

  return User;
};

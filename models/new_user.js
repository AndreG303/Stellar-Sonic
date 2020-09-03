// I made this "NEW" user.js file to setup a user route without affecting the starter code

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define("User", {
        username: DataTypes.STRING,
        favoriteBand: DataTypes.STRING
    });
    return User
};
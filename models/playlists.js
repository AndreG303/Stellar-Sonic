// Add a flag for the text attribute to prevent this field from being null
User = require("./user");
// Add a validation for the text attribute to make sure it's at least one character,
// but no more than 140 characters


module.exports = function(sequelize, DataTypes) {
  var Playlists = sequelize.define("Playlists", {
    play_list_name: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 140]
      }
    },artist: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 140]
      }
    },
    name: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 140]
      }
    }
  });

  Playlists.associate = function(models){
    Playlists.belongsTo(models.User, {
      foreignKey: {
        allowNull: false // makes sure that the post always has an author
      }
    });
  }


  return Playlists;
};

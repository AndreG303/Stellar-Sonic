// Add a flag for the text attribute to prevent this field from being null
User = require("./user");
// Add a validation for the text attribute to make sure it's at least one character,
// but no more than 140 characters


module.exports = function(sequelize, DataTypes) {
  var Playlists = sequelize.define("Playlists", {
    artist: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 140]
      }
    },
    coverArt: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 140]
      }
    },

    genre: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 140]
      }
    },

    title: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 190]
      }
    },
    year: { 
      type: DataTypes.INTEGER,
      allowNull:true,
    },
    youtubeVideo: { 
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
          len: [1, 190]
        }
    },
  
  });

  Playlists.associate = function(models){
    Playlists.belongsTo(models.User, {
      foreignKey: {
        allowNull: false // makes sure that the list always has an owner
      }
    });
  }


  return Playlists;
};

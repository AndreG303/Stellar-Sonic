// Add a flag for the text attribute to prevent this field from being null
// Add a validation for the text attribute to make sure it's at least one character,
// but no more than 140 characters
User = require("./user");

module.exports = function (sequelize, DataTypes) {
  var PlaylistsUsers = sequelize.define("PlaylistsUsers", {
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    coverArt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },

    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 190]
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    youtubeVideo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 190]
      }


    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 190]
      },
    },
    UserId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 190]
      }
    }
  });

  PlaylistsUsers.associate = function (models) {
    PlaylistsUsers.belongsTo(models.User, {
      foreignKey: {
        allowNull: false // makes sure that the list always has an owner
      }
    });
  }


  return PlaylistsUsers;
};

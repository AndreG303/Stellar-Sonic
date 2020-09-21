// // Add a flag for the text attribute to prevent this field from being null

// // Add a validation for the text attribute to make sure it's at least one character,
// // but no more than 140 characters

// // Add a flag for complete so that it's false by default if not given a value

module.exports = function(sequelize, DataTypes) {
  var MainList = sequelize.define("MainList", {
    
    artist: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [1, 140]
      }
    },
    release: { 
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
        len: [1, 140]
      }
    },
    year: { 
      type: DataTypes.INTEGER,
      allowNull:true,
      
    },
    duration: { 
      type: DataTypes.DECIMAL(13,8),
      allowNull:true,
      
    }
    
  });
  return MainList;
};

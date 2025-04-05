const makeBlogTable = (sequelize,DataTypes)=>{
      const Blog = sequelize.define('blog',{
            title : {
                  type : DataTypes.STRING,
                  allowNull : false                
            },
            subtitle : {
                  type : DataTypes.STRING,
                  allowNull : false                
            },
            description : {
                  type : DataTypes.TEXT,
                  allowNull : false                
            },
            image : {
                  type : DataTypes.STRING                
            }
            
      })
      return Blog // Return the Blog model
}

module.exports = makeBlogTable // Export the makeBlogTable function so that it can be used in other files
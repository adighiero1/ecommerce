const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }

    async createUser(userData) {
        try {
          const user = new UserModel(userData);
          return await user.save();
        } catch (error) {
          console.log(error);
          throw error; // Re-throw the error to be caught by the controller
        }
      }
    
      async findUser(email) {//different maybe it doesnt affect anything.
        try {
          return await UserModel.findOne({ email });
        } catch (error) {
          console.log(error);
          throw error; // Re-throw the error to be caught by the controller
        }
      }
    }






module.exports = UserRepository;

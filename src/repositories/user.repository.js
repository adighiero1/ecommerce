const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
    async getAllUsers() {
      return await UserModel.find();
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

      static async findInactiveSince(cutoffDate) {
        return UserModel.find({ last_connection: { $lt: cutoffDate } }); // Adjust field name as needed
    }

    static async deleteUsersByIds(userIds) {
        return UserModel.deleteMany({ _id: { $in: userIds } });
    }

    
      async findUser(email) {//different maybe it doesnt affect anything.
        try {
          return await UserModel.findOne({ email });
        } catch (error) {
          console.log(error);
          throw error; // Re-throw the error to be caught by the controller
        }
      }
      async updateUser(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }

    }






module.exports = UserRepository;

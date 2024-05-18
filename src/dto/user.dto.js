class UserDTO {
    constructor(firstName, lastName, role) {
        this.role = role;
      
        this.last = lastName;

        this.first = firstName;
        
    }
}

module.exports = UserDTO;
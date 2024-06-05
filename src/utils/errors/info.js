
const generateUserErrorInfo = (user) => {
    return `Incomplete data!
    We need the following data to be sent:
    - First Name: String, and we got: ${user.first_name}
    - Last Name: String, and we got: ${user.last_name}
    - Email: String, and we got: ${user.email}
    - Password: String, but we got: ${user.password ? 'a password was provided' : 'no password provided'}
    `;
}


module.exports = generateUserErrorInfo;

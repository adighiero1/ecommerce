class CustomError {
    static createError({ nname = "Error", ccause = "Unknown", message, ccode = 1 }) {
        const error = new Error(message);
        error.name = nname;
        error.cause = ccause;
        error.code = ccode;
        throw error;
    }
}

module.exports = CustomError;

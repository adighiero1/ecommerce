// middleware/error-handler.js
const EErrors = require("../utils/errors/enum.js");

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPE:
            res.send({ status: "error", error: error.name,  });
            break;
        case EErrors.MISSING_FIELDS:
            res.send({ status: "error", error: error.name,  });
            break;
        case EErrors.DUPLICATE_USER:
            res.send({ status: "error", error: error.name,  });
            break;
        case EErrors.CART_MISSING_FIELDS: // Add this case
            res.send({ status: "error", error: error.name, });
            break;
        default:
            res.send({ status: "error", error: "Unknown error" });
    }
};

module.exports = errorHandler;

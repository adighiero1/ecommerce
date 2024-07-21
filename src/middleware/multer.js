// const multer = require("multer"); 

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let destinationFolder; 
//         switch(file.fieldname) {
//             case "profile": 
//                 destinationFolder = "./src/uploads/profiles";
//                 break; 
//             case "products": 
//                 destinationFolder = "./src/uploads/products";
//                 break; 
//             case "document": 
//                 destinationFolder = "./src/uploads/documents"
//         }
//         cb(null, destinationFolder); 
//     }, 
//     filename: (req, file, cb) => {
//         cb(null, file.originalname); 
//     }
// })

// const upload = multer({storage:storage}); 

// module.exports = upload; 

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationFolder;
        switch(file.fieldname) {
            case "profile":
                destinationFolder = path.join(__dirname, "../uploads/profiles");
                break;
            case "products":
                destinationFolder = path.join(__dirname, "../uploads/products");
                break;
            case "documents":
                destinationFolder = path.join(__dirname, "../uploads/documents");
                break;
            default:
                return cb(new Error("Invalid fieldname"));
        }
        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
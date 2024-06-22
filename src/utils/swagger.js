const swaggerJSDoc= require("swagger-jsdoc");
const swaggerUiExpress= require( "swagger-ui-express"); 

//3) Creamos un objeto de configuración: swaggerOptions

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de la App Adoptame",
            description: "App Web dedicada a encontrar familias para los perritos de la calle"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions);

module.exports={swaggerOptions, specs}
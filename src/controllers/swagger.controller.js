
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

class SwaggerConfig {
  constructor() {
    this.swaggerOptions = {
      definition: {
        openapi: "3.0.1",
        info: {
          title: "VapeLife E-commerce documentation",
          description: "An E-commerce webapp for all your vaping needs",
        },
      },
      apis: ["./src/docs/**/*.yaml"],
    };
    this.swaggerSpec = swaggerJSDoc(this.swaggerOptions);
  }

  setup(router) {
    router.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(this.swaggerSpec));
  }
}

module.exports = SwaggerConfig;

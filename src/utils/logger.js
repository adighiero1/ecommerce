const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colores : {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

const logger = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "http",
            format: winston.format.combine(winston.format.colorize({colors: niveles.colores}), winston.format.simple())
        }),
        //Agregamos un nuevo transporte: 
        new winston.transports.File({
            filename: "./errors.log",
            level: "warning", 
            format: winston.format.simple()
        })
    ]
})



////////////////////////////////////////////////////////////////////////////////


//Una vez que configuramos el Logger, vamos a crear un middleware que lo utiliza. 

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

export default addLogger;
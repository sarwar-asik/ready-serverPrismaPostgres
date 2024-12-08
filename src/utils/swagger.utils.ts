import config from "../config"



export const swaggerTags = [
    {
        name: "User",
        description: "👤 User profile related API"
    },
    
]

export const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: ` ${config.server_name} Backend`,
        version: "1.0.0",
        description: `Api Design of  ${config.server_name}`,
        contact: {
            name: "Sarwar Hossain [Spark Tech Agency]",
            email: "sarwarasik@gmail.com",
            url: "https://www.linkedin.com/in/sarwar-asik/",
        },
        license: {
            name: "Bd Calling IT",
            url: "https://sparktech.agency/",
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",                
            },
        },
    },

}
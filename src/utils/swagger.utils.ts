import prisma from "../shared/prisma"
import { parsePrismaSchema } from "./modelConverterDocs"

export const swaggerTags = [
    // use different text icons for different tags
    {
        name: "User",
        description: "👤 User profile related API"
    },
    {
        name: "Auth",
        description: "🔑 Auth related API"
    },
    
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaModel:any = prisma

export const swaggerDefinition = parsePrismaSchema(prismaModel._engineConfig.inlineSchema as string)
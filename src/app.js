import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {serve,setup} from 'swagger-ui-express'
import swaggerSpec from "./config/swagger.js"
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api/v1/api-docs',serve,setup(swaggerSpec))




export {app}
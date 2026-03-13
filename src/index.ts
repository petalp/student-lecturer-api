import express from "express";
import { config } from "@/config/config.js";
import baseRoute from "@/base_route/index.route.js";
import { errorHandlingMiddleware } from "@/middleware/errorHandling.middleware.js";
import dotenv from "dotenv"
import { sendMail } from "./config/nodemailer.js";

dotenv.config();

const server = express();

server.use(express.json());

server.use(express.urlencoded({extended:true}))

server.get("/health-check", (req, res) => {
  res.status(200).json({ message: "server is healthy" });
});

server.get("/test", (req, res)=>{
  res.status(200).json({ message: "test route is working" });
})

server.post("/test", (req, res)=>{
  res.status(200).json({ message: "test route is working" });
})

server.get("/test/:id", (req, res)=>{
  console.log(req.params.id);
  res.status(200).json({ message: "test route is working" });
})
server.post("/send-mail", async(req, res)=>{
  try {
    const { emailAddress, subject, html } = req.body;
    
    await sendMail(emailAddress, subject, html);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
})

server.use(baseRoute);
server.use(errorHandlingMiddleware);

server.listen(config.PORT, "0.0.0.0", () => {
  if(process.env.NODE_ENV === "development"){
    console.log(`Server is running on http://localhost:${config.PORT}`);
  }
});

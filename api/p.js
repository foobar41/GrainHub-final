const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const multer = require("multer");
const path = require("path");
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs'); 
const swaggerDocument = YAML.load('./swagger/swagger.yaml');


dotenv.config();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname,"/images")))
app.use(cors())

//Add images to local storage
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,"images")
    },filename:(req,file,cb) =>{
        cb(null,req.body.name);
    },
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"),(req,res)=>{
    res.status(200).json("file has been uploaded");
})


//Routes

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);



//Local host port
app.listen("5000",()=>{
    console.log("Backend is running ...");
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
)
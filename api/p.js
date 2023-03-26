const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const eventRoute = require("./routes/Events")
const multer = require("multer");
const path = require("path");
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs'); 
const swaggerDocument = YAML.load('./swagger/swagger.yaml');


dotenv.config();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname,"/images")))


//Connecting mongodb
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));

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
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);
app.use("/api/events",eventRoute);



//Local host port
app.listen("5000",()=>{
    console.log("Backend is running ...");
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
)
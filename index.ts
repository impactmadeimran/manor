import express from "express";
import authRoutes from './routes/authRoutes'
import propertyRoutes from './routes/propertyRoutes'
import residencyRoutes from './routes/residencyRoutes'
import bodyParser from "body-parser";

const app = express();
const port = 8080;


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
app.use(bodyParser.json())
app.use('/auth', authRoutes)
app.use('/property', propertyRoutes)
app.use('/residency', residencyRoutes)
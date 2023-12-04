import express from "express";
import authRoutes from './routes/authRoutes'
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
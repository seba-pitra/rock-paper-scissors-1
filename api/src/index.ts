import express, { Express, NextFunction, Request, Response } from "express";
import cors   from "cors";
import router from "./routes/index";
import path   from "path";

const port: string | number = process.env.PORT || 3001;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/", router);

app.use((err, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-line no-unused-vars
  const status  = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log("El puerto funciona en el numero:" + port);
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

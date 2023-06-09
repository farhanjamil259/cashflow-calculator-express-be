import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";

const app: Application = express();

//Initialize middleware
app.use(express.json({ limit: "300kb" }));
app.use(cors({ origin: "*" }));

//connect database
connectDB();

//api test route
app.get("/", (req: Request, res: Response) => {
  res.send("API Online");
});

//api routes
app.use("/api/assumptions", require("./routes/api/assumptions"));
app.use("/api/inputs", require("./routes/api/inputs"));
app.use("/api/forecast", require("./routes/api/forecast"));
app.use("/api/summary", require("./routes/api/summary"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/client", require("./routes/api/client"));
app.use("/api/events", require("./routes/api/events"));
app.use("/api/needs", require("./routes/api/needsanalyis"));

//Set port and listen to the set port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

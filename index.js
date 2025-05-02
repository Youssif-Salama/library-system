import express from "express";
import env from "dotenv";
import connection from "./src/db/db.connection.js";
import v1Router from "./src/routers/v1.router.js";

env.config();

const server = express();

server.use(express.json());
server.use("/api/v1",v1Router)

const Port = process.env.PORT || 3000;
server.use((err,req,res,next)=>{
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
})
connection
  .then(() => {
    server.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

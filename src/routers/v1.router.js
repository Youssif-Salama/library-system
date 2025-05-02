import {Router} from "express";
import memberRoutes from "../modules/routes/members.routes.js";
import borrowingRoutes from "../modules/routes/borrowings.routes.js";
import bookRoutes from "../modules/routes/books.routes.js";
import aggregationRoutes from "../modules/routes/aggregation.routes.js";

const v1Router= Router();

v1Router.use("/members",memberRoutes);
v1Router.use("/borrowings",borrowingRoutes);
v1Router.use("/books",bookRoutes);
v1Router.use("/aggregations",aggregationRoutes);

export default v1Router;
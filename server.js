import express from "express";
import cors from "cors";
import { router as routes } from "./api/routes.js";

const app = express();

/* Use our middleware */
app.use(cors());
/* Our server can accept json in a body of request */
app.use(express.json());

/* Main url would be in our restaurant file */
app.use("/api/v1", routes);

/* What happens if someone goes to a route that's not in our file */
/* app.use("*", (req, res) => res.status(400).json({ error: "Not found" })); */

export { app };

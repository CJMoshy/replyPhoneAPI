import express, {
    Express,
    Router,
    ErrorRequestHandler,
    NextFunction,
} from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../build/routes";
import swaggerDocument from "../build/swagger.json";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = Router();
RegisterRoutes(router);
app.use("/api/v0", router);

app.use("/api/v0/docs", swaggerUi.serve);
app.use("/api/v0/docs", swaggerUi.setup(swaggerDocument));
app.get("/", (_req, res) => {
    res.redirect(_req.baseUrl + "/api/v0/docs");
});

const errorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next: NextFunction
) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
        status: err.status || 500,
    });
    _next();
};
app.use(errorHandler);

export default app;

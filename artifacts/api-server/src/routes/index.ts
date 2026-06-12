import { Router, type IRouter } from "express";
import healthRouter from "./health";
import journalRouter from "./journal";
import notificationsRouter from "./notifications";
import graphsRouter from "./graphs";
import ragRouter from "./rag";
import settingsRouter from "./settings";
import projectsRouter from "./projects";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(journalRouter);
router.use(notificationsRouter);
router.use(graphsRouter);
router.use(ragRouter);
router.use(settingsRouter);
router.use(projectsRouter);
router.use(dashboardRouter);

export default router;

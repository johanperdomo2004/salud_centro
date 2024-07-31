import { Router } from "express";
import {
  resetLoansStatus,
  resetStockStatus,
  resetRequestedsStatus,
  resetExpiredStatus,
 
  getCounters,
} from "../controllers/Counter.Controller.yacb.js";

const route = Router();

route.post("/resetloans", resetLoansStatus);
route.post("/resetstock", resetStockStatus);
route.post("/resetrequesteds", resetRequestedsStatus);
route.post("/resetexpired", resetExpiredStatus);

route.get("/get", getCounters);

export default route;

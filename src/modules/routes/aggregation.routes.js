import { Router } from "express";
import {
  totalBooksCountPerMember,
  avgBooksPerMembershipType,
  getMembersWithMinBorrowings,
  getMembershipTypeStats,
} from "../controllers/aggregation.controllers.js";

const aggregationRoutes = Router();

aggregationRoutes.get("/members/:memberId/total-books", totalBooksCountPerMember);

aggregationRoutes.get("/membership-types/avg-books", avgBooksPerMembershipType);

aggregationRoutes.get("/members/min-borrowings", getMembersWithMinBorrowings);

aggregationRoutes.get("/membership-types/stats", getMembershipTypeStats);

export default aggregationRoutes;
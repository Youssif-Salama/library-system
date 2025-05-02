import { Router } from "express";
import { attachCreateQuery, attachDeleteQuery, attachGetQuery, attachUpdateQuery } from "../../middlewares/queries.middlewares.js";
import membersModel from "../models/members.model.js";
import execution, { validator } from "../../middlewares/globals.middlewares.js";
import { createMemberSchema, updateMemberSchema } from "../../validations/members.validation.schemas.js";
import { filterQueryMiddleware, highLevelFilterQueryMiddleware } from "../../middlewares/features.middlewares.js";
import cascadeDeleteMethod from "../../methods/cadscade.delete.methods.js";
import borrowingsModel from "../models/borrowings.model.js";
import { allBooksBorrowingsByAspecificMember, allBooksThatBoworrowedByTwoOrMoreDiffMembers } from "../controllers/members.controllers.js";

const memberRoutes= Router();

memberRoutes.post("/",validator(createMemberSchema),attachCreateQuery(membersModel),execution({
  success: {
    status: 201,
    message: "Member created successfully",
  },
  failure: {
    status: 400,
    message: "Failed to create member",
  },
}));

memberRoutes.put("/:id",validator(updateMemberSchema),attachUpdateQuery(membersModel),filterQueryMiddleware({field:"_id",value:"id"}),execution({
  success: {
    status: 200,
    message: "Member updated successfully",
  },
  failure: {
    status: 400,
    message: "Failed to update member",
  },
}))

memberRoutes.delete("/:id",attachDeleteQuery(membersModel),filterQueryMiddleware({field:"_id",value:"id"}),execution({
  success: {
    status: 200,
    message: "Member deleted successfully",
  },
  failure: {
    status: 400,
    message: "Failed to delete member",
  },
},cascadeDeleteMethod({
  model:borrowingsModel,
  field:"member",
  value:"id"
})));

memberRoutes.get("/",attachGetQuery(membersModel),highLevelFilterQueryMiddleware({field:"joinDate",value:"beforeYear",case:"lt"}),execution({
  success: {
    status: 200,
    message: "Members retrieved successfully",
  },
  failure: {
    status: 400,
    message: "Failed to retrieve members",
  },
}));

memberRoutes.get("/:id",attachGetQuery(membersModel),filterQueryMiddleware({field:"_id",value:"id"}),execution({
  success: {
    status: 200,
    message: "Member retrieved successfully",
  },
  failure: {
    status: 400,
    message: "Failed to retrieve member",
  },
}));

// postman
memberRoutes.get("/:memberId/books",allBooksBorrowingsByAspecificMember)
memberRoutes.get("/:memberId/2diff/books",allBooksThatBoworrowedByTwoOrMoreDiffMembers)

export default memberRoutes;
import { defineEnt, defineEntSchema, getEntDefinitions } from "convex-ents";
import { v } from "convex/values";
import { vPermission, vRole } from "./permissions";

const schema = defineEntSchema(
  {
    teams: defineEnt({
      name: v.string(),
      isPersonal: v.boolean(),
    })
      .field("slug", v.string(), { unique: true })
      .edges("members"),

    members: defineEnt({})
      .edge("team")
      .edge("user")
      .edge("role")
      .index("teamUser", ["teamId", "userId"]),

    roles: defineEnt({})
      .field("name", vRole, { unique: true })
      .edges("permissions"),

    permissions: defineEnt({})
      .field("name", vPermission, { unique: true })
      .edges("roles"),

    users: defineEnt({
      firstName: v.string(),
      lastName: v.string(),
      fullName: v.string(),
      pictureUrl: v.string(),
      email: v.string(),
    })
      .field("tokenIdentifier", v.string(), { unique: true })
      .edges("members"),
  },
  { schemaValidation: false }
);

export default schema;

export const entDefinitions = getEntDefinitions(schema);

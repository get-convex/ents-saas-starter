/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as functions from "../functions.js";
import type * as init from "../init.js";
import type * as invites from "../invites.js";
import type * as permissions from "../permissions.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as users_teams from "../users/teams.js";
import type * as users_teams_members from "../users/teams/members.js";
import type * as users_teams_members_invites from "../users/teams/members/invites.js";
import type * as users_teams_messages from "../users/teams/messages.js";
import type * as users_teams_roles from "../users/teams/roles.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  functions: typeof functions;
  init: typeof init;
  invites: typeof invites;
  permissions: typeof permissions;
  types: typeof types;
  users: typeof users;
  "users/teams": typeof users_teams;
  "users/teams/members": typeof users_teams_members;
  "users/teams/members/invites": typeof users_teams_members_invites;
  "users/teams/messages": typeof users_teams_messages;
  "users/teams/roles": typeof users_teams_roles;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  query as baseQuery,
} from "./_generated/server";
import { mutationCtxWithRules, queryCtxWithRules } from "./rules";

export const query = customQuery(
  baseQuery,
  customCtx(async (baseCtx) => {
    const { ctx } = await queryCtxWithRules(baseCtx);
    return ctx;
  })
);

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (baseCtx) => {
    const { ctx } = await queryCtxWithRules(baseCtx);
    return ctx;
  })
);

export const mutation = customMutation(
  baseMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtxWithRules(baseCtx);
  })
);

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtxWithRules(baseCtx);
  })
);

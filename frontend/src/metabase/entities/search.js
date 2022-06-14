import { createEntity } from "metabase/lib/entities";

import { GET, POST } from "metabase/lib/api";

import {
  ObjectUnionSchema,
  ENTITIES_SCHEMA_MAP,
  entityTypeForObject,
} from "metabase/schema";

import { canonicalCollectionId } from "metabase/entities/collections";

const ENTITIES_TYPES = Object.keys(ENTITIES_SCHEMA_MAP);

const searchList = POST("/api/v1/database/dataset/search");
const collectionList = GET("/api/v1/collection/:collection/items");

export default createEntity({
  name: "search",
  path: "/api/search",

  api: {
    list: async (query = {}) => {
      if (query.collection) {
        const {
          collection,
          archived,
          models,
          namespace,
          pinned_state,
          limit,
          offset,
          sort_column,
          sort_direction,
          ...unsupported
        } = query;
        if (Object.keys(unsupported).length > 0) {
          throw new Error(
            "search with `collection` filter does not support these filters: " +
              Object.keys(unsupported).join(", "),
          );
        }

        const { data, ...rest } = await collectionList({
          collection,
          archived,
          models: models ? models : ["no_models"],
          namespace,
          pinned_state,
          limit,
          offset,
          sort_column,
          sort_direction,
        });
        let tempData = data;
        // eslint-disable-next-line no-prototype-builtins
        if (rest.hasOwnProperty("code") && data) {
          tempData = data.data;
        }
        return {
          ...rest,
          data: tempData
            ? tempData.map(item => ({
                collection_id: canonicalCollectionId(collection),
                archived: archived || false,
                ...item,
              }))
            : [],
        };
      } else {
        return searchList(query);
      }
    },
  },

  schema: ObjectUnionSchema,

  // delegate to the actual object's entity wrapEntity
  wrapEntity(object, dispatch = null) {
    const entities = require("metabase/entities");
    const entity = entities[entityTypeForObject(object)];
    if (entity) {
      return entity.wrapEntity(object, dispatch);
    } else {
      console.warn("Couldn't find entity for object", object);
      return object;
    }
  },

  // delegate to each entity's actionShouldInvalidateLists
  actionShouldInvalidateLists(action) {
    const entities = require("metabase/entities");
    for (const type of ENTITIES_TYPES) {
      if (entities[type].actionShouldInvalidateLists(action)) {
        return true;
      }
    }
    return false;
  },
});

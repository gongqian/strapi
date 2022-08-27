"use strict";

/**
 * translation router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter('api::translation.translation');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const customRoutes = [
  {
    method: "GET",
    path: "/translations/export",
    handler: "translation.export",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/translations/import",
    handler: "translation.import",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: "/translations/reset/all",
    handler: "translation.reset",
    config: {
      policies: [],
    },
  }
];

module.exports = customRouter(defaultRouter, customRoutes);
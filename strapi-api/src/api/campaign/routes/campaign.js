const { createCoreRouter } = require('@strapi/strapi').factories;

 module.exports = createCoreRouter('api::campaign.campaign');

 const customRouter = ( innerRouter, extraRoutes = [] ) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if( !routes ) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    }
  }
 }

 const customRoutes = [
  {
    method: "GET",
    path: "/campaigns/:campaginId/details",
    handler: "campaign.getDetails",
    config:{
      policies: [],
    }
  }
 ]

'use strict';

/**
 * A set of functions called "actions" for `campaign`
 */
 const { createCoreController } = require('@strapi/strapi').factories;

 module.exports = createCoreController(
  'api::campaign.campaign',
  ({strapi}) => ({
    getDetails: async (ctx) => {
      const compaginId = ctx.params.compaginId;
      const result = await strapi.entityService.findOne(
        "api::shop-detail.shop-details",
        {
          fields: [],
          filters:{
            $and : [
              { compaginId: compaginId},
              {},
            ]
          },
          _limit: 1,
        }
        )
    }
  })
  );

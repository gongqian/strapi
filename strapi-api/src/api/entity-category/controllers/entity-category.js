'use strict';

/**
 * A set of functions called "actions" for `entity-category`
 */

// module.exports = {
//   // exampleAction: async (ctx, next) => {
//   //   try {
//   //     ctx.body = 'ok';
//   //   } catch (err) {
//   //     ctx.body = err;
//   //   }
//   // }
// };

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::entity-category.entity-category');

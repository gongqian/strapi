// module.exports = {
//   routes: [
//     // {
//     //  method: 'GET',
//     //  path: '/entity-category',
//     //  handler: 'entity-category.exampleAction',
//     //  config: {
//     //    policies: [],
//     //    middlewares: [],
//     //  },
//     // },
//   ],
// };

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::entity-category.entity-category');

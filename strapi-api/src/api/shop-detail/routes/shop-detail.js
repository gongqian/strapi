// module.exports = {
//   routes: [
//     // {
//     //  method: 'GET',
//     //  path: '/shop-detail',
//     //  handler: 'shop-detail.exampleAction',
//     //  config: {
//     //    policies: [],
//     //    middlewares: [],
//     //  },
//     // },
//   ],
// };


const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::shop-detail.shop-detail');

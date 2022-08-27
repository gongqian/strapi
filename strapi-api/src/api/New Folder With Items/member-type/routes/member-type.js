// module.exports = {
//   routes: [
//     // {
//     //  method: 'GET',
//     //  path: '/member-type',
//     //  handler: 'member-type.exampleAction',
//     //  config: {
//     //    policies: [],
//     //    middlewares: [],
//     //  },
//     // },
//   ],
// };
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::member-type.member-type');

// module.exports = {
//   routes: [
//     // {
//     //  method: 'GET',
//     //  path: '/member',
//     //  handler: 'member.exampleAction',
//     //  config: {
//     //    policies: [],
//     //    middlewares: [],
//     //  },
//     // },
//   ],
// };
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::member.member');

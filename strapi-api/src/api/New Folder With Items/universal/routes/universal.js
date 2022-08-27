"use strict";

/**
 * universal router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

// module.exports = createCoreRouter('api::translation.translation', {
//     only: ['find'],
//     config: {
//       find: {
//         auth: false,
//         policies: [],
//         middlewares: [],
//       }
//     }
//   });

module.exports =
{
  "routes": [
    {
      "method": "GET",
      "path": "/universals",
      "handler": "universal.find",
      "config": {
        "policies": []
      }
    },
    // {
    //   "method": "GET",
    //   "path": "/universals/count",
    //   "handler": "universal.count",
    //   "config": {
    //     "policies": []
    //   }
    // },
    {
      "method": "GET",
      "path": "/universals/:id",
      "handler": "universal.findOne",
      "config": {
        "policies": []
      }
    },
    {
      "method": "POST",
      "path": "/universals",
      "handler": "universal.create",
      "config": {
        "policies": []
      }
    },
    {
      "method": "PUT",
      "path": "/universals/:id",
      "handler": "universal.update",
      "config": {
        "policies": []
      }
    },
    {
      "method": "DELETE",
      "path": "/universals/:id",
      "handler": "universal.delete",
      "config": {
        "policies": []
      }
    }
  ]
}

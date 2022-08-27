"use strict";

/**
 * language router.
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

module.exports = {
  "routes": [
    {
      "method": "GET",
      "path": "/languages",
      "handler": "language.find",
      "config": {
        "policies": []
      }
    },
    // {
    //   "method": "GET",
    //   "path": "/languages/count",
    //   "handler": "language.count",
    //   "config": {
    //     "policies": []
    //   }
    // },
    {
      "method": "GET",
      "path": "/languages/:id",
      "handler": "language.findOne",
      "config": {
        "policies": []
      }
    },
    {
      "method": "POST",
      "path": "/languages",
      "handler": "language.create",
      "config": {
        "policies": []
      }
    },
    {
      "method": "PUT",
      "path": "/languages/:id",
      "handler": "language.update",
      "config": {
        "policies": []
      }
    },
    {
      "method": "DELETE",
      "path": "/languages/:id",
      "handler": "language.delete",
      "config": {
        "policies": []
      }
    }
  ]
}

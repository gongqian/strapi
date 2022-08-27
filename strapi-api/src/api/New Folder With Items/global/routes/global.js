"use strict";

/**
 * language router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;


module.exports = {
  "routes": [
    // {
    //   "method": "GET",
    //   "path": "/global",
    //   "handler": "global.find",
    //   "config": {
    //     "policies": []
    //   }
    // },
    {
      "method": "PUT",
      "path": "/global",
      "handler": "global.update",
      "config": {
        "policies": []
      }
    },
    {
      "method": "DELETE",
      "path": "/global",
      "handler": "global.delete",
      "config": {
        "policies": []
      }
    }
  ]
}

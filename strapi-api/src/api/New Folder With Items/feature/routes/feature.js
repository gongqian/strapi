"use strict";

/**
 * language router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;


module.exports = {
  "routes": [
    {
      "method": "GET",
      "path": "/features",
      "handler": "feature.find",
      "config": {
        "policies": []
      }
    },
    // {
    //   "method": "GET",
    //   "path": "/features/count",
    //   "handler": "feature.count",
    //   "config": {
    //     "policies": []
    //   }
    // },
    {
      "method": "GET",
      "path": "/features/:id",
      "handler": "feature.findOne",
      "config": {
        "policies": []
      }
    },
    {
      "method": "POST",
      "path": "/features",
      "handler": "feature.create",
      "config": {
        "policies": []
      }
    },
    {
      "method": "PUT",
      "path": "/features/:id",
      "handler": "feature.update",
      "config": {
        "policies": []
      }
    },
    {
      "method": "DELETE",
      "path": "/features/:id",
      "handler": "feature.delete",
      "config": {
        "policies": []
      }
    }
  ]
}

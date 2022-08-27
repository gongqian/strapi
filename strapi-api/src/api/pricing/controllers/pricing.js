'use strict';

/**
 * A set of functions called "actions" for `product-pricing`
 */

 const { createCoreController } = require('@strapi/strapi').factories;

 module.exports = createCoreController('api::pricing.pricing');

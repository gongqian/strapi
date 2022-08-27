'use strict';

/**
 * product-pricing service.
 */

 const { createCoreService } = require('@strapi/strapi').factories;

 module.exports = createCoreService('api::pricing.pricing');

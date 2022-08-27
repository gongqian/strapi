'use strict';

/**
 * shop-response service.
 */

// module.exports = () => ({});

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::shop-response.shop-response');

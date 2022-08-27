'use strict';

/**
 * entity-category service.
 */

// module.exports = () => ({});
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::entity-category.entity-category');

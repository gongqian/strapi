'use strict';

/**
 * member-type service.
 */

// module.exports = () => ({});
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::member-type.member-type');

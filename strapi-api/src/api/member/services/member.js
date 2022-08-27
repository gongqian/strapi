'use strict';

/**
 * member service.
 */

// module.exports = () => ({});

const { createCoreService} = require('@strapi/strapi').factories;

module.exports = createCoreService('api::member.member');

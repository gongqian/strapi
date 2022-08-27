'use strict';
/**
 * univeral service.
 */

 const { createCoreService } = require('@strapi/strapi').factories;

 module.exports = createCoreService('api::universal.universal');

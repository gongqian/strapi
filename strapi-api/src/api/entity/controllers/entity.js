'use strict';

/**
 * A set of functions called "actions" for `entity`
 */

 const { createCoreController } = require('@strapi/strapi').factories;

 module.exports = createCoreController('api::entity.entity');

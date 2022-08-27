'use strict';

/**
 * A set of functions called "actions" for `entity-member`
 */

 const { createCoreController } = require('@strapi/strapi').factories;

 module.exports = createCoreController('api::entity-member.entity-member');

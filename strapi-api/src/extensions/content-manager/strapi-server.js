module.exports = (plugin) => {
  const getService = (name) => {
    return strapi.plugin("content-manager").service(name);
  };

  const populatedFindOneModelConfiguration = (id) => {
    return strapi.entityService.findOne(
      "api::model-configuration.model-configuration",
      id,
      {
        populate: {
          spotlight_configuration: {
            fields: ["id"],
            populate: {
              interior: {
                fields: ["id"],
                populate: {
                  images: {
                    fields: ["id"],
                    populate: '*'
                  },
                },
              },
              exterior: {
                fields: ["id"],
                populate: {
                  images: {
                    fields: ["id"],
                    populate: '*',
                  },
                },
              },
            },
          },
        },
      }
    );
  }

  const populatedFindOnePoster = (id) => {
    return strapi.entityService.findOne(
      "api::poster.poster",
      id,
      {
        populate: {
          qr_config: {
            fields: [
              "id",
              "scene",
              "page",
              "check_path",
              "env_version",
              "width",
              "auto_color",
              "is_hyaline",
            ],
            populate: '*'
          },
        },
      }
    );
  }

  const originalFindOne = plugin.controllers["collection-types"].findOne;
  plugin.controllers["collection-types"].findOne = async (ctx) => {
    await originalFindOne(ctx);
    const { userAbility } = ctx.state;
    const { model, id } = ctx.params;

    const permissionChecker = getService("permission-checker").create({
      userAbility,
      model,
    });

    if (model === "api::model-configuration.model-configuration") {
      const populatedResults = await populatedFindOneModelConfiguration(id);
      ctx.body = await permissionChecker.sanitizeOutput(populatedResults);
    }
    if (model === "api::poster.poster") {
      const populatedResults = await populatedFindOnePoster(id);
      ctx.body = await permissionChecker.sanitizeOutput(populatedResults);
    }

  };

  const originalUpdate = plugin.controllers["collection-types"].update;
  plugin.controllers["collection-types"].update = async (ctx) => {
    await originalUpdate(ctx);
    const { userAbility } = ctx.state;
    const { id, model } = ctx.params;

    const permissionChecker = getService('permission-checker').create({ userAbility, model });

    if (model === "api::model-configuration.model-configuration") {
      const populatedResults = await populatedFindOneModelConfiguration(id);
      ctx.body = await permissionChecker.sanitizeOutput(populatedResults);
    }
    if (model === "api::poster.poster") {
      const populatedResults = await populatedFindOnePoster(id);
      ctx.body = await permissionChecker.sanitizeOutput(populatedResults);
    }
  }

  return plugin;
};

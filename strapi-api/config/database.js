module.exports = ({ env }) => ({
  defaultConnection: "default",
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "HOST"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "d2ccdevd"),
      schema: env("DATABASE_SCHEMA", "public"),
      user: env("DATABASE_USERNAME", "SI_NAQ_200286_T_DB"),
      password: env("DATABASE_PASSWORD", "strapi"),
      ssl: env.bool("DATABASE_SSL", false),
    },
    pool: {
      max: env.int("DATABASE_MAX_POOL", 25),
    }
  },
});
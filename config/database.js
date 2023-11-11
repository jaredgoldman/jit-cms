const path = require("path");

module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT", "postgres");

  const connections = {
    postgres: {
      connection: {
        client: "postgres",
        connection: {
          host: env("PGHOST", "strapidb"),
          port: env.int("PGPORT", 5433),
          database: env("PGDATABASE", "jazzintoronto"),
          user: env("PGUSER", "jazzintoronto"),
          password: env("PGPASSWORD", "password"),
          ssl: env.bool(true),
        },
        pool: { min: 0 },
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db")
        ),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};

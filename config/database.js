module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "strapidb"),
      port: env.int("DATABASE_PORT", 5433),
      database: env("DATABASE_NAME", "jazzintoronto"),
      user: env("DATABASE_USERNAME", "jazzintoronto"),
      password: env("DATABASE_PASSWORD", "password"),
      ssl: {
        rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false), // For self-signed certificates
      },
    },
    debug: true,
  },
});

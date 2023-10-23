module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("PGHOST", "jitdb"),
      port: env.int("PGPORT", 5432),
      database: env("PGDATABASE", "jazzintoronto"),
      user: env("PGUSER", "jazzintoronto"),
      password: env("PGPASSWORD", "password"),
      ssl: env.bool(true),
    },
    pool: { min: 0 },
  },
});

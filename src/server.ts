import fastify from "fastify";

const app = fastify();

app.get("/hello", () => {
  return "Hello World.NodeJS!";
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running");
  });

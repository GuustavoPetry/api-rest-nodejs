import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/add", async () => {
  const transaction = await knex("transactions").insert({
    id: crypto.randomUUID(),
    title: "Transação de Teste 2",
    amount: 2000
  })
  .returning("*");

  return transaction;
});

app.get("/search", async () => {
  const transactions = await knex("transactions")
    .where("amount", 2000)
    .select("*");

  return transactions;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP server running");
  });

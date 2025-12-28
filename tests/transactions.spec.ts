import { it, beforeAll, afterAll, describe } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions Routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    // Roda apenas este teste na execução
    it.only("should be able to create a new transaction", async () => {
        const response = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })
            .expect(201);

        console.log(response.headers);
    });

    // Pula esse teste na execução
    it.skip("should be able to list all transactions", async () => {

    });

    // Marca teste como -> a fazer
    it.todo("Any test", async () => {});
});


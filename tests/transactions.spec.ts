import { it, beforeAll, afterAll, beforeEach, describe } from "vitest";
import supertest from "supertest";
import { app } from "../src/app";

describe("Transactions Routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a new transaction", async () => {
        await supertest(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })
            .expect(201);
    });

    it.only("should be able to list all transactions", async () => {
        const agent = supertest.agent(app.server);

        await agent
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            });

        await agent
            .get("/transactions")
            .expect(200);
    });

});


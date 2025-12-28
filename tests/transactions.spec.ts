import { it, beforeAll, afterAll, beforeEach, describe, expect } from "vitest";
import { execSync } from "node:child_process"; // Executa comandos no terminal via código
import supertest, { SuperAgentTest } from "supertest";
import { app } from "../src/app";

describe("Transactions Routes", () => {
    let agent: supertest.Agent;

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        // Agent novo para cada teste -> garante independência
        agent = supertest.agent(app.server);

        // resetar banco no beforeEach garante independência
        // Acaba tomando mais tempo -> tests End-to-End
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    });

    it("should be able to create a new transaction", async () => {
        await agent
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })
            .expect(201);
    });

    it("should be able to list all transactions", async () => {
        await agent
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            });

        const listTransactionResponse =
            await agent
                .get("/transactions")
                .expect(200);

        expect(listTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "New Transaction",
                amount: 5000
            })
        ]);
    });

    it("should be able to get a specific transaction", async () => {
        await agent
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            });

        const listTransactionResponse =
            await agent
                .get("/transactions")
                .expect(200);

        const transactionId = listTransactionResponse.body.transactions[0].id;

        const getTransactionResponse =
            await agent
                .get(`/transactions/${transactionId}`)
                .expect(200);

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: "New Transaction",
                amount: 5000
            })
        );
    });

    it("should be able to get the summary", async () => {
        await agent
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            });

        await agent
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 3000,
                type: "debit"
            });

        const summaryResponse =
            await agent
                .get("/transactions/summary")
                .expect(200);

        expect(summaryResponse.body.summary).toEqual({
            amount: 2000
        });
    });
});


import { config } from "dotenv";
import { z } from "zod";

// Se process.env.NODE_ENV === test -> preenchido sozinho pelo vitest, 
// o arquivo de configuração .env passa a ser -> .env.test
// que possui DATABASE_URL diferente, ou seja, 
// cria um novo arquivo de banco -> test.db
if (process.env.NODE_ENV === "test") {
    config({ path: ".env.test" });
} else {
    config();
}

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
    DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.log("Invalid Environment Variables", _env.error.format());

    throw new Error("Invalid Environment Variables");
}

export const env = _env.data;


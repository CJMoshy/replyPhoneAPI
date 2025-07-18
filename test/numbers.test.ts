
import {
    test,
    beforeAll,
    afterAll,
    describe,
    afterEach,
    expect,
} from "vitest";

import supertest from "supertest";
import * as nodehttp from "http";
import app from "../src/app";
import { db } from '../src/db/db'
import { phoneNumbersTable } from "../src/db/schema";

let server: nodehttp.Server<
    typeof nodehttp.IncomingMessage,
    typeof nodehttp.ServerResponse
>;

beforeAll(async () => {
    server = nodehttp.createServer(app);
    server.listen();
});

afterEach(async () => {
    await db.delete(phoneNumbersTable)
})

afterAll(() => {
    server.close();
});

const URL = "/api/v0/number"
const addNumber = async (number: string, expectedCode: number) => {
    await supertest(server).
        post(URL)
        .send({ phoneNumber: number, status: true })
        .expect(expectedCode)
}

const updateNumber = async (number: string, expectedCode: number) => {
    const response = await supertest(server)
        .put(URL)
        .send({ phoneNumber: number })
        .expect(expectedCode)
    return response
}

describe("Test Suite for Phone number API", () => {

    test("Add A Number", async () => {
        await addNumber("+141513456", 201)
    })

    test("Cannot add the same number twice", async () => {
        await addNumber("+141513456", 201)
        await addNumber("+141513456", 409)
    })

    test("Update a Number", async () => {
        await addNumber("+141513456", 201)
        const response = await updateNumber("+141513456", 200)
        expect(response.body.status).toBeDefined()
        expect(response.body.status).toBe(false)
    })

    test("Update number 404 not found", async () => {
        await updateNumber("+141513456", 404)
    })
})
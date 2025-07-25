
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
import { phoneNumbersTable, apiKeyTable } from "../src/db/schema";
import { NumberResponse } from "../src/numbers";

let server: nodehttp.Server<
    typeof nodehttp.IncomingMessage,
    typeof nodehttp.ServerResponse
>;

beforeAll(async () => {
    server = nodehttp.createServer(app);
    server.listen();
    await db.insert(apiKeyTable).values({ key: "testapikey" })
});

afterEach(async () => {
    await db.delete(phoneNumbersTable)
})

afterAll(async () => {
    await db.delete(apiKeyTable)
    server.close();
});

const URL = "/api/v0/number"
const addNumber = async (number: string, expectedCode: number) => {
    await supertest(server).
        post(URL)
        .set("key", "testapikey")
        .send({ phoneNumber: number, status: true })
        .expect(expectedCode)
}

const updateNumber = async (number: string, status: boolean, expectedCode: number) => {
    const response = await supertest(server)
        .put(URL)
        .set("key", "testapikey")
        .send({ phoneNumber: number, status })
        .expect(expectedCode)
    return response
}

const deleteNumber = async (number: string, expectedCode: number) => {
    const response = await supertest(server)
        .delete(URL + "/" + number)
        .set("key", "testapikey")
        .expect(expectedCode)
    return response
}

describe("Test Suite for Phone number API", () => {

    test("Cannot add a number without API key", async () => {
        await supertest(server)
            .post(URL)
            .set("key", "notvalidkey")
            .send({ phoneNumber: "14151234567" })
            .expect(401)
    })

    describe("Regex Validation Tests", () => {
        test("Regex parser for adding a number", async () => {
            await addNumber("invaid", 409)
        })

        test("Fails: missing digits", async () => {
            await addNumber("415-555", 409) // too short
        })

        test("Fails: too many digits", async () => {
            await addNumber("415-555-123456", 409)
        })

        test("Fails: letters in number", async () => {
            await addNumber("415-ABC-1234", 409)
        })

        test("Fails: no digits at all", async () => {
            await addNumber("hello-world", 409)
        })

        test("Fails: special characters only", async () => {
            await addNumber("!@#$%^&*()", 409)
        })

        test("Fails: international non-US number", async () => {
            await addNumber("+44 20 7946 0958", 409) // UK number
        })

        test("Fails: misplaced country code", async () => {
            await addNumber("415-555-1234+1", 409)
        })

        test("Fails: extra whitespace", async () => {
            await addNumber(" 415 - 555 - 1234 ", 409)
        })

        test("Fails: country code but invalid number", async () => {
            await addNumber("+1 123", 409)
        })
    })

    describe("Creating Numbers", () => {
        test("Add A Number", async () => {
            await addNumber("+14151234567", 201)
        })

        test("Add A Number with no status defaults to true", async () => {
            const response = await supertest(server).
                post(URL)
                .set("key", "testapikey")
                .send({ phoneNumber: "+14151234567" })
                .expect(201)
            expect(response.body.status).toBeDefined()
            expect(response.body.status).toBe(true)
        })

        test("Cannot add the same number twice", async () => {
            await addNumber("+14151234567", 201)
            await addNumber("+14151234567", 409)
        })

    })

    describe("Updating Numbers", () => {
        test("Update a Number - taken", async () => {
            await addNumber("+14151234567", 201)
            const response = await updateNumber("+14151234567", false, 200)
            expect(response.body.status).toBeDefined()
            expect(response.body.status).toBe(false)
        })

        test("Update a Number - available", async () => {
            await addNumber("+14151234567", 201)
            const response = await updateNumber("+14151234567", false, 200)
            expect(response.body.status).toBeDefined()
            expect(response.body.status).toBe(false)

            // Now update it back to available
            const response2 = await updateNumber("+14151234567", true, 200)
            expect(response2.body.status).toBeDefined()
            expect(response2.body.status).toBe(true)
        })

        test("Update number with no status makes it unavailable", async () => {
            await addNumber("+14151234567", 201)
            const response = await supertest(server)
                .put(URL)
                .set("key", "testapikey")
                .send({ phoneNumber: "+14151234567" })
                .expect(200)
            expect(response.body.status).toBeDefined()
            expect(response.body.status).toBe(false)
        })

        test("Update number 404 not found", async () => {
            await updateNumber("+14151234567", false, 404)
        })

    })

    describe("Get Numbers", () => {
        test("Get Phone Numbers", async () => {
            await addNumber("+14151234567", 201)
            await addNumber("+14151234568", 201)
            await addNumber("+14151234569", 201)

            const response = await supertest(server)
                .get(URL)
                .expect(200)

            const { body } = response
            expect(body).toBeDefined()
            expect((body as NumberResponse[]).length).toBe(3)
            expect((body as NumberResponse[])[0].phoneNumber).toBe("+14151234567")
        })

        test("Get Phone Numbers only returns available numbers", async () => {
            await addNumber("+14151234567", 201)
            await addNumber("+14151234568", 201)
            await addNumber("+14151234569", 201)

            // Update one number to unavailable
            await updateNumber("+14151234567", false, 200)

            const response = await supertest(server)
                .get(URL)
                .expect(200)

            const { body } = response
            expect(body).toBeDefined()
            expect((body as NumberResponse[]).length).toBe(2)
            expect((body as NumberResponse[])[0].phoneNumber).toBe("+14151234568")
        })

        test("Get All Phone Numbers", async () => {
            await addNumber("+14151234567", 201)
            await addNumber("+14151234568", 201)
            await addNumber("+14151234569", 201)

            await updateNumber("+14151234567", false, 200)
            const response = await supertest(server)
                .get(URL + "/all")
                .expect(200)

            const { body } = response
            expect(body).toBeDefined()
            expect((body as NumberResponse[]).length).toBe(3)
            expect((body as NumberResponse[]).some(obj => obj.phoneNumber === "+14151234567")).toBe(true)
        })

        describe("Deleting Numbers", () => {

            test("Cannot delete a number without API key", async () => {
                await supertest(server)
                    .delete(URL + "/+14151234567")
                    .set("key", "notvalidkey")
                    .expect(401)
            })

            test("Cannot delete a number that does not exist", async () => {
                const response = await deleteNumber("+14151234567", 404)
                expect(response.body).toBeDefined()
            })

            test("Delete a Number", async () => {
                await addNumber("+14151234567", 201)
                const response = await deleteNumber("+14151234567", 200)
                expect(response.body).toBeDefined()
                expect(response.body.phoneNumber).toBe("+14151234567")
            })
        })
    })
})
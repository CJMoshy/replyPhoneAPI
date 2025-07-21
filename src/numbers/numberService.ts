import { phoneNumbersTable } from "../db/schema";
import { db } from "../db/db"; // your drizzle instance
import { eq } from "drizzle-orm";
import { NumberResponse, NumberRequest } from ".";
import { validateOrReject } from "class-validator";

export class NumberService {
  public async create(data: NumberRequest): Promise<NumberResponse> {
    // Validate the request
    await validateOrReject(Object.assign(new NumberRequest(), data));

    const now = new Date();

    const [inserted] = await db
      .insert(phoneNumbersTable)
      .values({
        phoneNumber: data.phoneNumber,
        status: data.status ?? true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const response: NumberResponse = {
      id: inserted.id,
      phoneNumber: inserted.phoneNumber,
      status: inserted.status === true,
    };

    return response;
  }

  public async update(data: NumberRequest): Promise<NumberResponse | undefined> {

    const exists = await this.exists(data.phoneNumber)
    if (!exists) {
      return undefined
    }

    const [updated] = await db
      .update(phoneNumbersTable)
      .set({ status: false })
      .where(eq(phoneNumbersTable.phoneNumber, data.phoneNumber))
      .returning()

    const response: NumberResponse = {
      id: updated.id,
      phoneNumber: updated.phoneNumber,
      status: updated.status === true,
    };

    return response
  }

  private async exists(phoneNumber: string) {
    const [exists] = await db
      .select()
      .from(phoneNumbersTable)
      .where(eq(phoneNumbersTable.phoneNumber, phoneNumber))

    return exists
  }

  public async getAvailableNumbers(): Promise<NumberResponse[]> {
    const result = await db
      .select()
      .from(phoneNumbersTable)
      .where(eq(phoneNumbersTable.status, false));

    return result.map((row) => ({
      id: row.id,
      phoneNumber: row.phoneNumber,
      status: row.status,
    }));
  }
}

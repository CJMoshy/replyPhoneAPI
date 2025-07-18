import { phoneNumbersTable } from "../db/schema";
import { db } from "../db/db"; // your drizzle instance
import { eq } from "drizzle-orm";
import { NumberResponse, NumberRequest } from ".";

export class NumberService {
  public async create(data: NumberRequest): Promise<NumberResponse> {
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
      status: inserted.status==true,
    };

    return response;
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

import { phoneNumbersTable } from "../db/schema";
import { db } from "../db/db"; // your drizzle instance
import { eq,and } from "drizzle-orm";
import { NumberResponse, NumberRequest, NewNumberResponse, NumberCreateData } from ".";

export class NumberService {

  private async exists(phoneNumber: string) {
    const [exists] = await db
      .select()
      .from(phoneNumbersTable)
      .where(eq(phoneNumbersTable.phoneNumber, phoneNumber))

    return exists
  }

  public async create(data: NumberRequest): Promise<NumberResponse | undefined> {
    const phoneRegex = /^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    if (!phoneRegex.test(data.phoneNumber)) {
      return undefined
    }

    const exists = await this.exists(data.phoneNumber)
    if (exists) {
      return undefined
    }

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

  public async update(data: NumberCreateData): Promise<NumberResponse | undefined> {

    // const exists = await this.exists(data.phoneNumber)
    const exists=await db.select().from(phoneNumbersTable).where(eq(phoneNumbersTable.phoneNumber,data.phoneNumber))
    if (exists.length>0) {
      // check for email
      // if phone number exists, make a update 
      const updated=await db.update(phoneNumbersTable).set({
        email:data.email||"unassigned",
        status:data.email?false:true,
        updatedAt:new Date()
      })
      .where(eq(phoneNumbersTable.phoneNumber,data.phoneNumber)).returning();

      const response: NumberResponse = {
      id: updated[0].id,
      phoneNumber: updated[0].phoneNumber,
      status: updated[0].status,
      };
      return response
    }
    // here insert the data if it does not exists

    const result = await db.insert(phoneNumbersTable).values({
          phoneNumber:data.phoneNumber,
          email:data.email || "unassigned",
          status:data.email?false:true,
          createdAt:new Date()
        }).returning();

    const res:NumberResponse={
      id:result[0].id,
      phoneNumber:result[0].phoneNumber,
      status:result[0].status,
    }
    return res
  }


  // get a single phone number

  public async getNumbersWithUser():Promise<NewNumberResponse[]>{
    const result=await db.select().from(phoneNumbersTable)
    // return the result
    return result.map((row)=>({
      id: row.id,
      phoneNumber: row.phoneNumber,
      status: row.status,
      email: row.status ? "unassigned" : (row.email ?? "unassigned")
    }))
  }

  // get unassigned phone numbers
  public async getUnassignedNumbers():Promise<NumberResponse[]>{
    const result=await db
                        .select()
                        .from(phoneNumbersTable)
                        .where(and(
                          eq(phoneNumbersTable.status,true)
                        ));

    return result.map((row)=>({
      id:row.id,
      phoneNumber:row.phoneNumber,
      status:row.status
    }))
  }


  public async getAvailableNumbers(): Promise<NumberResponse[]> {
    const result = await db
      .select()
      .from(phoneNumbersTable)
      .where(eq(phoneNumbersTable.status, true));

    return result.map((row) => ({
      id: row.id,
      phoneNumber: row.phoneNumber,
      status: row.status,
    }));
  }

  public async getAllNumbers(): Promise<NumberResponse[]> {
    const result = await db.select().from(phoneNumbersTable);

    return result.map((row) => ({
      id: row.id,
      phoneNumber: row.phoneNumber,
      status: row.status,
    }));
  }

  public async delete(phoneNumber: string): Promise<NumberResponse | undefined> {
    const exists = await this.exists(phoneNumber)
    if (!exists) {
      return undefined
    }

    const [deleted] = await db
      .delete(phoneNumbersTable)
      .where(eq(phoneNumbersTable.phoneNumber, phoneNumber))
      .returning()

    const response: NumberResponse = {
      id: deleted.id,
      phoneNumber: deleted.phoneNumber,
      status: deleted.status === true,
    };

    return response
  }
}


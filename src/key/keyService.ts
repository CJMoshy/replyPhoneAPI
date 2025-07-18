import { db } from "../db/db";
import { apiKeyTable } from '../db/schema'
import { eq } from "drizzle-orm";

export default class KeyService {
    public async check(key: string) {

        const [keyInDB] = await db.select()
            .from(apiKeyTable)
            .where(eq(apiKeyTable.key, key))

        if (!keyInDB) return false

        return true
    }
}
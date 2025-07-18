import {
    Body,
    Controller,
    Header,
    Post,
    Put,
    Response,
    Route,
    SuccessResponse,
} from "tsoa";
import { NumberService } from "./numberService";
import { NumberRequest, NumberResponse } from "."
import KeyService from "../key/keyService";

@Route("number")
export class MemberController extends Controller {
    @Post()
    @Response("401", "Unauthorized")
    @Response("409", "Conflict")
    @SuccessResponse("201", "Number Created")
    public async create(
        @Header() key: string,
        @Body() data: NumberRequest,
    ): Promise<NumberResponse | undefined> {
        const authorized = await new KeyService().check(key)
        if (!authorized) {
            this.setStatus(401)
            return
        }
        const response = await new NumberService().create(data);
        if (response === undefined) {
            this.setStatus(409)
        }
        return response
    }

    @Put()
    @Response("401", "Unauthorized")
    @Response("404", "Phone Number Not Found")
    @SuccessResponse("200", "Phone Number Updated")
    public async update(
        @Header() key: string,
        @Body() data: NumberRequest,
    ): Promise<NumberResponse | undefined> {
        const authorized = await new KeyService().check(key)
        if (!authorized) {
            this.setStatus(401)
            return
        }
        const response = await new NumberService().update(data)
        if (response === undefined) {
            this.setStatus(404)
        }
        return response
    }
}
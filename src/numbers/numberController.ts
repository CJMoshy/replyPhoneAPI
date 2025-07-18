import {
    Body,
    Controller,
    Post,
    Put,
    Response,
    Route,
    SuccessResponse,
} from "tsoa";
import { NumberService } from "./numberService";
import { NumberRequest, NumberResponse } from "."

@Route("number")
export class MemberController extends Controller {
    @Post()
    @Response("409", "Conflict")
    @SuccessResponse("201", "Number Created")
    public async create(
        @Body() data: NumberRequest,
    ): Promise<NumberResponse | undefined> {
        const response = await new NumberService().create(data);
        if (response === undefined) {
            this.setStatus(409)
        }
        return response
    }

    @Put()
    @Response("404", "Phone Number Not Found")
    @SuccessResponse("200", "Phone Number Updated")
    public async update(
        @Body() data: NumberRequest,
    ): Promise<NumberResponse | undefined> {
        const response = await new NumberService().update(data)
        if (response === undefined) {
            this.setStatus(404)
        }
        return response
    }
}
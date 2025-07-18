import {
    Body,
    Controller,
    Post,
    Response,
    Route,
    SuccessResponse,
} from "tsoa";
import { NumberService } from "./numberService";
import {NumberRequest,NumberResponse} from "."

@Route("number")
export class MemberController extends Controller {
    @Post()
    @Response("409", "Conflict")
    @SuccessResponse("201", "Number Created")
    public async create(
        @Body() data: NumberRequest,
    ): Promise<NumberResponse> {
        return await new NumberService().create(data);
    }
}
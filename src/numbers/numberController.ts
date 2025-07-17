import {
    Body,
    Controller,
    Post,
    Response,
    Route,
    SuccessResponse,
} from "tsoa";
import { NumberService } from "./numberService";

@Route("number")
export class MemberController extends Controller {
    @Post()
    @Response("409", "Conflict")
    @SuccessResponse("201", "Number Created")
    public async create(
        @Body() data: any
    ): Promise<any | undefined> {
        const newNumber = await new NumberService().create(data);
        // verify number created

        
        return newNumber;
    }
}
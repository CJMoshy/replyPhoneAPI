import {
    Body,
    Controller,
    Get,
    Post,
    Response,
    Route,
    SuccessResponse,
} from "tsoa";
import { NumberService } from "./numberService";
import {NumberRequest,NumberResponse} from "."

@Route("number")
export class MemberController extends Controller {
    // API to add an available phone number onto the database.
    @Post()
    @Response("409", "Conflict")
    @SuccessResponse("201", "Number Created")
    public async create(
        @Body() data: NumberRequest,
    ): Promise<NumberResponse> {
        return await new NumberService().create(data);
    }

    // API to fetch the list of available phone numbers.
    @Get("/available")
    @SuccessResponse("200", "List of Available Numbers")
    @Response("500", "Internal Server Error")
    public async getAvailablePhoneNumbers(): Promise<NumberResponse[]> {
        const service = new NumberService();
        return await service.getAvailableNumbers();
    }
}
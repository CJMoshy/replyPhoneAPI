import {
    Body,
    Controller,
    Delete,
    Get,
    Header,
    Post,
    Put,
    Response,
    Route,
    SuccessResponse,
    Path
} from "tsoa";
import { NumberService } from "./numberService";
import { NumberRequest, NumberResponse,NewNumberResponse, NumberCreateData } from "."
import KeyService from "../key/keyService";

@Route("number")
export class NumberController extends Controller {
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
    @Response("404", "Phone Number Not Found")
    @SuccessResponse("200", "Phone Number Updated")
    public async update(
        @Body() data: NumberCreateData,
    ): Promise<NumberResponse | undefined> {
        const response = await new NumberService().update(data)
        if (response === undefined) {
            this.setStatus(404)
        }
        return response
    }

    @Get()
    @SuccessResponse("200", "List of Available Numbers")
    @Response("500", "Internal Server Error")
    public async getAvailablePhoneNumbers(): Promise<NumberResponse[]> {
        return await new NumberService().getAvailableNumbers();
    }

    @Get("/all")
    @SuccessResponse("200", "List of Available Numbers")
    @Response("500", "Internal Server Error")
    public async getAllPhoneNumbers(): Promise<NumberResponse[]> {
        return await new NumberService().getAllNumbers();
    }

    @Delete("{phoneNumber}")
    @Response("404", "Phone Number Not Found")
    @SuccessResponse("200", "Phone Number Deleted")
    public async delete(
        @Header() key: string,
        @Path() phoneNumber: string
    ): Promise<NumberResponse | undefined> {
        const authorized = await new KeyService().check(key)
        if (!authorized) {
            this.setStatus(401)
            return
        }
        const response = await new NumberService().delete(phoneNumber);
        if (response === undefined) {
            this.setStatus(404)
        }
        return response
    }


    // below is dhruv's code

    
    // user to which the number belongs
    // status is true if number is  unassigned
    // status is false if number is assigned to a user
    // display all numbers if status is false return username, if status us true userid value is unassigned
    // add user name field as a migration to the phone numbers table using alter table command


    @Get("/with_user")
    @SuccessResponse("200","List of Numbers with Usernames")
    @Response("500","Internal Server Error")
    public async getNumbersWithUser(): Promise<NewNumberResponse[]> {
        return await new NumberService().getNumbersWithUser();
    }

    @Get("/unassigned")
    @SuccessResponse("200","List of unassigned numbers")
    @Response("500","Internal Server Error")
    public async getUnassignedNumbers(): Promise<NumberResponse[]> {
        return await new NumberService().getUnassignedNumbers();
    }


}
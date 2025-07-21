// types go here
import { IsPhoneNumber, IsOptional, IsBoolean } from "class-validator";


export interface NumberResponse {
  id: string;              // uuid from `id`
  phoneNumber: string;     // varchar(20)
  status: boolean;         // boolean
}

export interface NumberRequest {
  phoneNumber: string;
  status?: boolean; // optional, defaults to true
}

export class NumberRequest {
  @IsPhoneNumber('US', { message: "Invalid phone number format" })
  phoneNumber: string = "";

  @IsOptional()
  @IsBoolean()
  status?: boolean = true;
}
import { IsEmail, isNotEmpty, IsNotEmpty, IsNumber } from "class-validator";

export class OtpVerificationDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsNumber()
    @IsNotEmpty()
    otp:number
}
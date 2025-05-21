import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ResetPasswordDto{
    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    newPassword: string

    @IsNumber()
    @IsNotEmpty()
    otp:number
}
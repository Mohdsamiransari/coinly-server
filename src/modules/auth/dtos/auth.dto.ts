import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Unique } from "typeorm";

export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password: string
    
}
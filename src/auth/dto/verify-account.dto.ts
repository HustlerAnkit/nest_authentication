import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class verifyAccountDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumber()
    @IsNotEmpty()
    otp: number
}
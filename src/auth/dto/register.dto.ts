import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class RegisterDTO {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string    
}
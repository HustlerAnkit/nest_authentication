import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDetailsDTO {
    @IsString()
    @IsNotEmpty()
    address: string

    @IsNotEmpty()
    @IsString()
    city: string

    @IsOptional()
    @IsString()
    state?: string

    @IsNotEmpty()
    @IsString()
    country: string
}
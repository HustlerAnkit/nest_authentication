import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STATUS } from "src/config/entities";

export class CreatePostDTO {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    caption: string

    @IsOptional()
    @IsEnum({ entity: STATUS })
    status?: STATUS
}
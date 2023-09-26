import { IsNotEmpty, IsString } from "class-validator";

export class CommentPostDTO{
    @IsNotEmpty()
    @IsString()
    comment: string
}
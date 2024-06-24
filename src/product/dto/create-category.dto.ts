import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsUUID()
    groupId: string;

    @IsString()
    image_url: string;
}
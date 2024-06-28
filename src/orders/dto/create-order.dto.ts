import { IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({
        description: 'An array of item IDs to be included in the order',
        example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
        type: [String]
    })
    @IsNotEmpty()
    @IsArray()
    @IsUUID('4', { each: true })
    itemsIds: string[];
}

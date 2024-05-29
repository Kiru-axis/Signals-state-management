import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClientLocationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

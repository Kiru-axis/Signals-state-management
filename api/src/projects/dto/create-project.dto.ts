import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsDateString()
  @IsNotEmpty()
  dateOfStart: Date;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  teamSize: number;

  @IsString()
  @IsNotEmpty()
  clientLocationId: string;
}

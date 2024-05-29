import { PartialType } from '@nestjs/swagger';
import { CreateClientLocationDto } from './create-client-location.dto';

export class UpdateClientLocationDto extends PartialType(CreateClientLocationDto) {}

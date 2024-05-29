import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientLocationsService } from './client-locations.service';
import { CreateClientLocationDto } from './dto/create-client-location.dto';
import { UpdateClientLocationDto } from './dto/update-client-location.dto';
import { PublicRoute } from 'src/common';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';

@Controller('client-locations')
export class ClientLocationsController {
  constructor(
    private readonly clientLocationsService: ClientLocationsService,
  ) {}

  @Post()
  async create(@Body() createClientLocationDto: CreateClientLocationDto) {
    return this.clientLocationsService.create(createClientLocationDto);
  }

  @PublicRoute()
  @Get()
  async findAll() {
    return this.clientLocationsService.findAll();
  }

  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientLocationsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientLocationDto: UpdateClientLocationDto,
  ) {
    return this.clientLocationsService.update(id, updateClientLocationDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clientLocationsService.remove(id);
  }
}

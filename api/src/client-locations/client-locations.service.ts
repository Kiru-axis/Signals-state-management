import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientLocationDto } from './dto/create-client-location.dto';
import { UpdateClientLocationDto } from './dto/update-client-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.clientLocation.findMany();
  }

  async create(dto: CreateClientLocationDto) {
    return await this.prisma.clientLocation.create({
      data: { name: dto.name },
    });
  }

  async findOne(id: string) {
    const location = await this.prisma.clientLocation.findUnique({
      where: { id },
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(id: string, dto: UpdateClientLocationDto) {
    await this.findOne(id);

    return await this.prisma.clientLocation.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.clientLocation.delete({ where: { id } });
  }
}

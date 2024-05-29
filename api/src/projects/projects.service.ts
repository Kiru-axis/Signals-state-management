import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.project.findMany();
  }

  async searchProjects(searchBy: string, searchTerm: string) {
    const projects = await this.prisma.project.findMany();

    if (!searchTerm || !searchBy) return projects;

    if (searchBy == 'id') {
      return projects.filter((project) =>
        project.id.includes(searchTerm.toLowerCase()),
      );
    } else if (searchBy == 'name') {
      return projects.filter((project) =>
        project.name.includes(searchTerm.toLowerCase()),
      );
    } else if (searchBy == 'dateOfStart') {
      return projects.filter((project) =>
        project.dateOfStart.toString().includes(searchTerm.toLowerCase()),
      );
    } else if (searchBy == 'teamSize') {
      return projects.filter((project) =>
        project.teamSize.toString().includes(searchTerm.toLowerCase()),
      );
    } else {
      return projects;
    }
  }

  async create(dto: CreateProjectDto) {
    await this._validateClientLocation(dto.clientLocationId);
    const project = await this.prisma.project.create({
      data: {
        active: dto.active,
        dateOfStart: dto.dateOfStart,
        name: dto.name,
        status: dto.status,
        teamSize: dto.teamSize,
        clientLocationId: dto.clientLocationId,
      },
    });
    return project;
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);

    if (dto.clientLocationId) {
      await this._validateClientLocation(dto.clientLocationId);
    }

    return await this.prisma.project.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.project.delete({ where: { id } });
  }

  // helpers
  private async _validateClientLocation(id: string) {
    const location = await this.prisma.clientLocation.findUnique({
      where: { id },
    });
    if (!location) throw new BadRequestException('Location does not exist');
    return location;
  }
}

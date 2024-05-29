import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PublicRoute } from 'src/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @PublicRoute()
  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @PublicRoute()
  @Get('/search/:searchBy/:searchTerm')
  async searchProjects(@Param() params: any) {
    // docs say the params are string[] but console.log shows an object hence any.

    return this.projectsService.searchProjects(
      params.searchBy,
      params.searchTerm,
    );
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}

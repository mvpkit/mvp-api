
import {
    Body, ConflictException, Controller, Delete, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Req, Request, UnauthorizedException,
    UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Crud, CrudUpdateDto, CrudLoginDto, CrudCreateDto } from './crud.entity';
import { CrudService } from './crud.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('crud')
export class CrudController {
  constructor(private crudService: CrudService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get cruds', description: 'Retrieve a list of cruds'  })
  async findAll(@Body() data) {
    return this.crudService.findAll(data);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get crud', description: 'Retrieves a crud record by id'  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const crud = await this.crudService.findOne(id);
    if (!crud) throw new NotFoundException();
    return crud;
  }

  @Post()
  @ApiOperation({ summary: 'Create crud', description: 'Creates a crud record'  })
  async create(@Body() dto: CrudCreateDto): Promise<Crud> {
    return await this.crudService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update crud', description: 'Update a crud record'  })
  async update(
    @Param('id') id: number,
    @Body() dto: CrudUpdateDto,
  ): Promise<Crud> {
    return await this.crudService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete crud', description: 'Delete a crud record'  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.crudService.remove(id);
  }


}

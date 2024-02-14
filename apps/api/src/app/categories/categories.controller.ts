import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';

import { ApiPathEnum, UserTokenParsedInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller(ApiPathEnum.Categories)
@ApiTags('categories')
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: PageOptionsDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<PageDto<CategoryEntity>> {
    return this.categoriesService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<CategoryEntity> {
    return this.categoriesService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @AuthenticatedUser() user: UserTokenParsedInterface,
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @AuthenticatedUser() user: UserTokenParsedInterface): Promise<CategoryEntity> {
    return this.categoriesService.remove(id, user);
  }
}

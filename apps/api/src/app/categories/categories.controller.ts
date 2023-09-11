import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiPathEnum, UserInterface } from '@financial-project/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
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
  @UseGuards(JwtAuthGuard)
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: UserInterface): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() params: PageOptionsDto, @CurrentUser() user: UserInterface): Promise<PageDto<CategoryEntity>> {
    return this.categoriesService.findAll(params, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<CategoryEntity> {
    return this.categoriesService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: UserInterface
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: UserInterface): Promise<CategoryEntity> {
    return this.categoriesService.remove(id, user);
  }
}

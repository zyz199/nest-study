import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { isPublic } from 'src/auth/constants';
import { Department } from './entites/department.entity';
import { ParseArrayPipe } from '@nestjs/common';

@ApiTags('部门管理')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiOperation({
    summary: '分页',
  })
  @Get('page')
  page(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('name') name?: string,
  ) {
    return this.departmentService.page(page, pageSize, name);
  }

  @ApiOperation({
    summary: '列表 - 支持模糊搜索',
  })
  @Get('list')
  @isPublic()
  list(@Query('name') name?: string) {
    return this.departmentService.findAll(name);
  }

  @ApiOperation({
    summary: '根据ID查询',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findById(id);
  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
  create(@Body() department: Department) {
    return this.departmentService.create(department);
  }

  @ApiOperation({
    summary: '修改',
  })
  @Put()
  update(@Body() department: Department) {
    return this.departmentService.update(department);
  }

  @ApiOperation({
    summary: '删除',
  })
  @Delete()
  delete(@Query('ids', new ParseArrayPipe()) ids: string[]) {
    return this.departmentService.delete(ids);
  }

  @ApiOperation({
    summary: '启用，禁用,支持批量操作',
  })
  @Post('status/:status')
  setStatus(
    @Param('status') status: number,
    @Query('ids', new ParseArrayPipe())
    ids: string[],
  ) {
    return this.departmentService.setStatus(ids, status);
  }
}

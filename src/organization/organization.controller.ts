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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { Organization } from './entities/organization.entity';
import { isPublic } from 'src/auth/constants';
import { ParseArrayPipe } from '@nestjs/common';

@ApiTags('组织架构模块')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({
    summary: '部门列表',
  })
  @Get('department/list')
  departmentList() {
    return this.organizationService.departmentList();
  }

  @ApiOperation({
    summary: '部门员工分页',
  })
  @Get('employee/page')
  employeePage(
    @Query('id') id: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('name') name?: string,
  ) {
    return this.organizationService.employeePage(id, page, pageSize, name);
  }

  @ApiOperation({
    summary: '删除部门员工 - 支持批量操作',
  })
  @Delete('employee')
  employeeDelete(@Query('ids', new ParseArrayPipe()) ids: string[]) {
    return this.organizationService.employeeDelete(ids);
  }

  @ApiOperation({
    summary: '组织结构 - 🌲结构',
  })
  @Get('tree')
  @isPublic()
  tree() {
    return this.organizationService.tree();
  }

  @ApiOperation({ summary: '根据ID查询组织架构' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findById(id);
  }

  @ApiOperation({
    summary: '创建部门',
  })
  @Post()
  create(@Body() organization: Organization) {
    return this.organizationService.create(organization);
  }

  @ApiOperation({
    summary: '添加员工',
  })
  @Post('employee')
  createEmployee(@Body() organization: Organization) {
    return this.organizationService.employeeCreate(organization);
  }

  @ApiOperation({ summary: '删除部门' })
  @Delete()
  delete(@Query('id') id: string) {
    return this.organizationService.delete(id);
  }

  @ApiOperation({
    summary: '置顶',
  })
  @Put('toTop')
  toTop(@Body('id') id: string) {
    return this.organizationService.toTop(id);
  }

  @ApiOperation({
    summary: '置底',
  })
  @Put('toBottom')
  toBottom(@Body('id') id: string) {
    return this.organizationService.toBottom(id);
  }

  @ApiOperation({
    summary: '上移',
  })
  @Put('moveUp')
  moveUp(@Body('id') id: string) {
    return this.organizationService.moveUp(id);
  }

  @ApiOperation({
    summary: '下移',
  })
  @Put('moveDown')
  movDown(@Body('id') id: string) {
    return this.organizationService.moveDown(id);
  }
}

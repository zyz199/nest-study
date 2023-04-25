import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HostParam,
  Inject,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';
import { CustomException } from 'src/common/exceptions/custom.exception';
import * as md5 from 'md5';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { isPublic } from 'src/auth/constants';
import { User } from 'src/common/decorators/user.decorator';
import { exportExcel } from 'src/common/utils/fileExport';
import { Response } from 'express';
import {
  ResetPasswordDto,
  RetrievePasswordDto,
  SendSMSDto,
} from './dto/employee.dto';

@ApiTags('员工模块')
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '员工登陆',
  })
  @isPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() employee: Employee) {
    const { username, password } = employee;
    const _employee = await this.employeeService.findByUsername(username);

    // 判断能否通过账号查询出用户信息
    if (!_employee) {
      // 查不到，返回用户名错误信息
      throw new CustomException('账号不存在，请重新输入');
    }

    // 判断员工是否被禁用
    if (_employee.status === 0) {
      throw new CustomException('当前员工已禁用');
    }

    // 能查到，对输入的密码进行 md5加密，对比密码，
    if (md5(password) !== _employee.password) {
      // 不一致，返回密码错误信息
      throw new CustomException('密码不对，请重新输入');
    }
    // 密码一致，返回用户信息-需要剔除密码
    const { password: _password, ...rest } = _employee;

    const tokenObj = await this.authService.login(_employee);
    return { ...rest, ...tokenObj };
  }

  @ApiOperation({
    summary: '修改密码',
  })
  @Post('resetPassword')
  resetPassword(@Body() data: ResetPasswordDto, @User('id') id: string) {
    return this.employeeService.resetPassword(data, id);
  }

  @ApiOperation({
    summary: '发送验证码',
  })
  @isPublic()
  @Post('sendSMS')
  sendSMS(@Body() data: SendSMSDto) {
    return this.employeeService.sendSMS(data);
  }

  @ApiOperation({
    summary: '找回密码',
  })
  @isPublic()
  @Post('retrievePassword')
  retrievePassword(@Body() data: RetrievePasswordDto) {
    return this.employeeService.retrievePassword(data);
  }

  @ApiOperation({
    summary: '分页',
  })
  @Get('page')
  page(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('name') name?: string,
  ) {
    return this.employeeService.page(page, pageSize, name);
  }

  @ApiOperation({
    summary: '根据员工状态查询',
    description: ' 启用 禁用 查询， 启用 1 禁用 0',
  })
  @Get('enable')
  enable(@Query('status') status: number) {
    return this.employeeService.findEnable(status);
  }

  @ApiOperation({
    summary: '创建员工',
  })
  @Post()
  create(@Body() employee: Employee) {
    employee.password = md5('123456');
    return this.employeeService.create(employee);
  }

  @ApiOperation({
    summary: '导出',
  })
  @Get('export')
  async exportXlsx(@Res() res: Response) {
    const allData = await this.employeeService.findAll();
    const buf = exportExcel(allData, '员工信息.xlsx');
    res.set(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('员工信息.xlsx') + '',
    );
    res.send(buf);
  }

  @ApiOperation({
    summary: '根据ID查询',
  })
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findById(id);
  }

  @ApiOperation({
    summary: '更新',
  })
  @Put()
  update(@Body() employee: Employee) {
    return this.employeeService.update(employee);
  }

  @ApiOperation({
    summary: '删除,支持批量操作',
  })
  @Delete()
  del(@Query('ids', new ParseArrayPipe()) ids: string[]) {
    return this.employeeService.delete(ids);
  }

  @ApiOperation({
    summary: '启用，禁用,支持批量操作',
  })
  @Post('status/:status')
  setStatus(
    @Param('status') status: number,
    @Query('ids', new ParseArrayPipe()) ids: string[],
  ) {
    return this.employeeService.setStatus(ids, status);
  }
}

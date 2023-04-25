import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '@/employee/employee.service';
import { Employee } from '@/employee/entities/employee.entity';
import * as md5 from 'md5';
import { TIdAndUsername } from '@/types/index';
import { CustomException } from '@/common/exceptions/custom.exception';
@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *
   * @param username 用户名
   * @param pass 密码
   * @returns 验证用户
   */
  async validateEmployee(
    username: Employee['username'],
    pass: Employee['password'],
  ) {
    const employee = await this.employeeService.findByUsername(username);
    if (employee?.password === md5(pass)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = employee;
      return rest;
    }
    throw new CustomException('密码不正确');
  }

  async login(employee: Pick<Employee, TIdAndUsername>) {
    const payload = { username: employee.username, id: employee.id };
    // 使用JWT生成token
    return {
      token: this.jwtService.sign(payload),
    };
  }
}

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { BasePage } from '../common/database/pageInfo';
import { classAssign } from '../common/utils/index';
import { CustomException } from 'src/common/exceptions/custom.exception';
import {
  ResetPasswordDto,
  RetrievePasswordDto,
  SendSMSDto,
} from './dto/employee.dto';
import * as md5 from 'md5';
import { Cache } from 'cache-manager';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManage: Cache,
  ) {}

  /**
   *
   * @param data
   * @returns 修改密码
   */
  async resetPassword(data: ResetPasswordDto, userId: string) {
    const employee = await this.employeeRepository.findOneBy({ id: userId });
    if (employee.password !== md5(data.oldPassword)) {
      throw new CustomException('旧密码不正确');
    }
    await this.employeeRepository.update(
      {
        id: userId,
      },
      { password: md5(data.newPassword) },
    );
    return true;
  }

  /**
   *
   * @param data
   * @returns 发送验证码
   */
  async sendSMS(data: SendSMSDto) {
    // 缓存期间内验证码只允许发送一次
    const SMSCode = await this.cacheManage.get<string>('SMS_' + data.phone);
    if (SMSCode) {
      throw new CustomException('短信验证码已发送');
    }
    // 查询用户信息
    const employee = await this.employeeRepository.findOneBy({
      phone: data.phone,
    });
    if (!employee) {
      throw new CustomException('手机号不存在');
    }
    // 缓存中获取 验证码
    const code = await this.cacheManage.get<string>('img_' + data.code);
    if (!code) {
      throw new CustomException('短信验证码失效或者不存在');
    }
    // 将短信验证码存入缓存 缓存5分钟
    await this.cacheManage.set('SMS_' + data.phone, '1234', 1000 * 60 * 5);
    return true;
  }

  /**
   *
   * @param data
   * @returns 找回密码
   */
  async retrievePassword(data: RetrievePasswordDto) {
    // 查询用户信息
    const employee = await this.employeeRepository.findOneBy({
      phone: data.phone,
    });
    if (!employee) {
      throw new CustomException('手机号不存在');
    }
    // 缓存中获取 图形验证码
    const code = await this.cacheManage.get<string>('img_' + data.code);
    if (!code) {
      throw new CustomException('图形验证码失效或者不存在');
    }
    // 获取短信验证码
    const SMSCode = await this.cacheManage.get('SMS_' + data.phone);

    if (SMSCode !== data.SMSCode) {
      throw new CustomException('短信验证码失效或者不存在');
    }

    if (md5(data.newPassword) === employee.password) {
      throw new CustomException('新密码不能和旧密码一样');
    }
    // 移除缓存数据
    await this.cacheManage.del('img_' + data.code);
    await this.cacheManage.del('SMS_' + employee.phone);
    // 更新
    await this.employeeRepository.update(
      {
        id: employee.id,
      },
      {
        password: md5(data.newPassword),
      },
    );
    return true;
  }

  /**
   *
   * @param username 用户名
   * @returns 根据账户名查找用户信息
   */
  async findByUsername(username: Employee['username']) {
    const res = await this.employeeRepository.findOneBy({ username });
    return res;
  }

  /**
   *
   * @param page 页数
   * @param pageSize 每页多少条
   * @param name 用户名
   * @returns 分页
   */
  async page(page: number, pageSize: number, name = '') {
    const [employeeList, total] = await this.employeeRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return new BasePage(page, pageSize, total, employeeList);
  }

  /**
   *
   * @param employee Employee
   * @returns 创建员工
   */
  create(employee: Employee) {
    return this.employeeRepository.save(classAssign(new Employee(), employee));
  }

  /**
   *
   * @param id id
   * @returns 根据ID查询
   */
  async findById(id: string) {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new CustomException('id不存在');
    }
    return employee;
  }

  /**
   *
   * @returns 查询所有数据
   */
  findAll() {
    return this.employeeRepository.find();
  }

  /**
   *
   * @param status 根据员工状态查询
   * @returns
   */
  findEnable(status: number) {
    return this.employeeRepository.findBy({ status });
  }

  /**
   *
   * @param employee
   * @returns 更新
   */
  async update(employee: Employee) {
    return !!(
      await this.employeeRepository.update(
        { id: employee.id },
        classAssign(new Employee(), employee),
      )
    ).affected;
  }

  /**
   *
   * @param ids ids
   * @returns 删除
   */
  async delete(ids: string[]) {
    // 只能删除停用的账号
    const count = await this.employeeRepository.countBy({
      id: In(ids),
      status: 1,
    });
    if (count > 0) {
      throw new CustomException('不能删除启用中的账号');
    }
    return !!(await this.employeeRepository.delete({ id: In(ids) })).affected;
  }

  /**
   *
   * @param ids ids
   * @returns 设置员工状态  启用 - 禁用
   */
  async setStatus(ids: string[], status: number) {
    const employee = new Employee();
    employee.status = status;
    return !!(await this.employeeRepository.update({ id: In(ids) }, employee))
      .affected;
  }
}

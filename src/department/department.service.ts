import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In } from 'typeorm';
import { Department } from './entites/department.entity';
import { BasePage } from '../common/database/pageInfo';
import { classAssign } from '../common/utils/index';
import { OrganizationService } from '../organization/organization.service';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly organizationService: OrganizationService,
  ) {}

  /**
   *
   * @param page 第几页
   * @param pageSize 页数
   * @param name 部门名称 - 模糊查询
   * @returns 分页查询
   */
  async page(page: number, pageSize: number, name = '') {
    const [department, count] = await this.departmentRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return new BasePage(page, pageSize, count, department);
  }

  /**
   *
   * @param id
   * @returns 根据id查询
   */
  findById(id: string) {
    return this.departmentRepository.findOneBy({ id });
  }

  /**
   *
   * @returns 返回全部列表数据 - 支持模糊查询
   */
  findAll(name = '') {
    return this.departmentRepository.findBy({ name: Like(`%${name}%`) });
  }

  /**
   *
   * @param department
   * @returns 新增
   */
  create(department: Department) {
    return this.departmentRepository.save(
      classAssign(new Department(), department),
    );
  }

  /**
   *
   * @param department
   * @returns 更新
   */
  async update(department: Department) {
    return !!(
      await this.departmentRepository.update(
        {
          id: department.id,
        },
        classAssign(new Department(), department),
      )
    ).affected;
  }

  /**
   *
   * @param ids
   * @returns 删除
   */
  async delete(ids: string[]) {
    // 只能删除禁用状态下的数据
    const departmentCount = await this.departmentRepository.countBy({
      id: In(ids),
      status: 1,
    });
    if (departmentCount > 0) {
      throw new CustomException('不能删除启用中的数据');
    }
    return !!(
      await this.departmentRepository.delete({
        id: In(ids),
      })
    ).affected;
  }

  /**
   *
   * @param ids
   * @param status
   * @returns 设置部门状态 启用 禁用
   */
  async setStatus(ids: string[], status: number) {
    // 设置禁用，不能禁用已经存在组织结构中的部门
    const organizationList = await this.organizationService.findByDIds(ids);
    if (organizationList?.length) {
      throw new CustomException('当前数据存在组织架构中，无法禁用');
    }
    const department = new Department();
    department.status = status;
    return !!(
      await this.departmentRepository.update(
        {
          id: In(ids),
        },
        department,
      )
    ).affected;
  }
}

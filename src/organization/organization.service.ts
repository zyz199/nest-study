import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository, In, Not, LessThan, MoreThan, Like } from 'typeorm';
import { classAssign, listToTree } from '../common/utils/index';
import { Department } from '../department/entites/department.entity';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { Transactional } from 'typeorm-transactional';
import { Employee } from '../employee/entities/employee.entity';
import { BasePage } from '@/common/database/pageInfo';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Department)
    private readonly departmentReposition: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeeReposition: Repository<Employee>,
  ) {}

  /**
   *
   * @returns 部门列表
   */
  async departmentList() {
    // 存在组织结构中的部门不显示
    const isDIds = await this.organizationRepository.find({
      select: ['dId'],
      where: {
        dId: Not(''),
      },
    });
    if (isDIds.length) {
      return this.departmentReposition
        .createQueryBuilder('department')
        .where(
          'department.id NOT IN (' + isDIds?.map((w) => w.dId).toString() + ')',
        )
        .getMany();
    } else {
      return this.departmentReposition.find();
    }
  }

  /**
   *
   * @param id id
   * @param page
   * @param pageSize
   * @param name
   * @returns 部门员工分页
   */
  async employeePage(id: string, page: number, pageSize: number, name = '') {
    // 获取当前部门下的员工id
    const eIds = await this.organizationRepository.find({
      select: ['eId'],
      where: { pId: id },
    });
    const [employeeList, count] = await this.employeeReposition.findAndCount({
      where: {
        id: In(eIds.map((w) => w.eId)),
        name: Like(`%${name}%`),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return new BasePage<Employee>(page, pageSize, count, employeeList);
  }

  /**
   *
   * @param organization
   * @returns 添加员工
   */
  async employeeCreate(organization: Organization) {
    // 判断当前组织下是否有相同的员工
    const eIdCount = await this.organizationRepository.countBy({
      pId: organization.pId,
      eId: organization.eId,
    });
    if (eIdCount > 0) {
      throw new CustomException('当前组织下存在相同的员工，无法添加');
    }
    await this.organizationRepository.save(
      classAssign(new Organization(), organization),
    );
    return true;
  }

  /**
   *
   * @param id
   * @returns 删除部门员工
   */
  async employeeDelete(ids: string[]) {
    return !!(
      await this.organizationRepository.delete({
        eId: In(ids),
      })
    ).affected;
  }
  /**
   *
   * @param id 根据id查询组织架构
   * @returns
   */
  async findById(id: string) {
    return this.organizationRepository.findOneBy({ id });
  }

  /**
   *
   * @param ids
   * @returns 根据部门id查询组织结构
   */
  findByDIds(ids: string[]) {
    return this.organizationRepository.findBy({
      dId: In(ids),
    });
  }

  /**
   *
   * @param organization
   * @returns 新增部门
   */
  async create(organization: Organization) {
    // 设置默认sort 自增
    let { maxSort } = await this.organizationRepository
      .createQueryBuilder('organization')
      .select('MAX(organization.sort)', 'maxSort')
      .getRawOne();

    const _organization = classAssign(new Organization(), organization);
    if (!maxSort) {
      maxSort = 1;
    } else {
      maxSort++;
    }
    _organization.sort = maxSort;
    return this.organizationRepository.save(_organization);
  }

  /**
   *
   * @returns 树结构
   */
  async tree() {
    return listToTree(
      await this.organizationRepository
        .createQueryBuilder('o1')
        .select()
        .leftJoinAndSelect('organization', 'o2', 'o1.id = o2.p_id')
        .where('o1.d_id IS NOT NULL')
        .orderBy('o1.sort', 'ASC')
        .getMany(),
    );
  }

  /**
   *
   * @param id
   * @returns 删除组织架构
   */
  async delete(id: string) {
    // 如果当前组织架构下存在客户或者组织结构，无法删除
    const count = await this.organizationRepository.countBy({
      pId: id,
    });
    if (count > 0) {
      throw new CustomException('此部门组织架构下存在组织或者员工，无法删除');
    }
    return !!(await this.organizationRepository.delete({ id })).affected;
  }

  /**
   *
   * @param id
   * @returns 置顶
   */
  @Transactional()
  async toTop(id: string) {
    // 查询到需要置顶的信息
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new CustomException('此部门数据不存在');
    }
    // 查询同级上一条数据
    const prev = await this.organizationRepository.findOneBy({
      sort: LessThan(organization.sort),
      pId: organization.pId,
    });
    if (!prev) {
      throw new CustomException('此部门已经处于置顶状态了');
    }
    // 置顶
    await this.organizationRepository
      .createQueryBuilder()
      .update(Organization)
      .set({
        sort: () => 'sort + 1',
      })
      .where('sort < :sort', { sort: organization.sort })
      .execute();
    await this.organizationRepository.update({ id }, { sort: 1 });
    return true;
  }

  /**
   *
   * @param id
   * @returns 置底
   */
  @Transactional()
  async toBottom(id: string) {
    // 查询需要置底的数据
    const organization = await this.organizationRepository.findOneBy({ id });
    // 查询同级下一条数据
    const last = await this.organizationRepository.findOne({
      where: {
        sort: MoreThan(organization.sort),
        pId: organization.pId,
      },
    });
    if (!last) {
      throw new CustomException('此部门已经处于最后了，无法下移');
    }

    // 获取最大sort
    const maxOrganization = await this.organizationRepository.findOne({
      where: {},
      order: {
        sort: 'DESC',
      },
    });
    if (!maxOrganization) {
      throw new CustomException('xxx');
    }
    // 置底
    await this.organizationRepository
      .createQueryBuilder()
      .update(Organization)
      .set({ sort: () => 'sort - 1' })
      .where('sort > :sort', { sort: organization.sort })
      .execute();
    await this.organizationRepository.update(
      {
        id: organization.id,
      },
      {
        sort: maxOrganization.sort,
      },
    );
    return true;
  }

  /**
   *
   * @param id
   * @returns 上移
   */
  @Transactional()
  async moveUp(id: string) {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new CustomException('此部门id不存在');
    }
    // 拿到同级上一条数据
    const prev = await this.organizationRepository.findOne({
      where: {
        sort: LessThan(organization.sort),
        pId: organization.pId,
      },
      order: {
        id: 'DESC',
      },
    });
    if (!prev) {
      throw new CustomException('此部门已经置顶了，无法上移');
    }
    // 交换 sort
    await this.organizationRepository.update(
      { id: organization.id },
      { sort: prev.sort },
    );
    await this.organizationRepository.update(
      { id: prev.id },
      { sort: organization.sort },
    );
    return true;
  }

  /**
   *
   * @param id
   * @returns 下移
   */
  @Transactional()
  async moveDown(id: string) {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new CustomException('此部门id不存在');
    }
    // 拿到同级下一条数据
    const next = await this.organizationRepository.findOne({
      where: {
        sort: MoreThan(organization.sort),
        pId: organization.pId,
      },
    });
    if (!next) {
      throw new CustomException('此部门已经处于最后了，无法下移');
    }
    // 交换 sort
    await this.organizationRepository.update(
      {
        id: organization.id,
      },
      {
        sort: next.sort,
      },
    );
    await this.organizationRepository.update(
      {
        id: next.id,
      },
      {
        sort: organization.sort,
      },
    );
    return true;
  }
}

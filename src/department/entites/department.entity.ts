import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/database/baseEntity';

@Entity({
  orderBy: {
    updateTime: 'DESC',
  },
})
export class Department extends BaseEntity {
  @ApiProperty({
    description: '部门名称',
  })
  @Column({
    comment: '部门名称',
  })
  name: string;

  @ApiProperty({
    description: '状态 0 禁用 1 启用',
  })
  @Column({
    comment: '状态 0 禁用 1 启用',
  })
  status: number;

  @ApiProperty({
    description: '部门头像',
  })
  @Column({
    comment: '部门头像',
  })
  avatar?: string;
}

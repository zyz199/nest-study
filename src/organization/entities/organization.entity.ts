import { BaseEntity } from '../../common/database/baseEntity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  orderBy: {
    updateTime: 'DESC',
  },
})
export class Organization extends BaseEntity {
  @ApiProperty({
    description: '组织架构名',
  })
  @Column({
    comment: '组织架构名',
  })
  name: string;

  @ApiProperty({
    description: '组织架构顺序',
  })
  @Column({
    comment: '组织架构顺序',
  })
  sort?: number;

  @ApiProperty({
    description: '部门ID',
  })
  @Column({
    comment: '部门ID',
  })
  dId: string;

  @ApiProperty({
    description: '员工ID',
  })
  @Column({
    comment: '员工ID',
  })
  eId: string;

  @ApiProperty({
    description: '父级ID',
  })
  @Column({
    comment: '父级ID',
  })
  pId: string;
}

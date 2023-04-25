import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class TrackLog {
  @ApiProperty({
    description: '主键ID',
  })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: '主键ID',
  })
  id: string;

  @ApiProperty({
    description: '模块名称',
  })
  @Column({
    comment: '模块名称',
  })
  moduleName: string;

  @ApiProperty({
    description: '模块时间',
  })
  @Column({
    comment: '模块时间',
  })
  moduleTime: string;

  @ApiProperty({
    description: '浏览量',
  })
  @Column({
    comment: '浏览量',
  })
  num: number;
}

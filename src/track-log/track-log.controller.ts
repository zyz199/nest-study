import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TrackLogService } from './track-log.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('轨迹记录-模块留痕')
@Controller('trackLog')
export class TrackLogController {
  constructor(private readonly trackLogService: TrackLogService) {}

  @ApiOperation({
    summary: '保存模块记录',
  })
  @Post()
  create(@Body('moduleName') moduleName: string) {
    return this.trackLogService.create(moduleName);
  }

  @ApiOperation({
    summary: '查询分组模块数量数据',
  })
  @Get('groupCount')
  groupCount() {
    return this.trackLogService.findGroupCount();
  }

  @ApiOperation({
    summary: '根据时间范围查询数据趋势',
  })
  @Get('dateRange')
  findDateRange(@Query('range') range: number) {
    return this.trackLogService.findDateRange(range);
  }
}

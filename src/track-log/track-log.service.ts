import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackLog } from './entities/track-log.entity';
import { Between, Raw, Repository } from 'typeorm';
import {
  stringToNumber,
  numberToString,
  getDateRangeList,
  dateFormat,
} from '../common/utils/index';
import { getMysqlStartDateAndEndDate } from '../common/utils/index';
import * as moment from 'moment';

interface GroupCount {
  num: string;
  moduleName: string;
}
export interface GroupCountRes extends GroupCount {
  value: number;
}

@Injectable()
export class TrackLogService {
  constructor(
    @InjectRepository(TrackLog)
    private readonly trackLogReposition: Repository<TrackLog>,
  ) {}

  /**
   *
   * @param moduleName
   * @returns 保存模块信息
   */
  async create(moduleName: string) {
    const trackLog = new TrackLog();
    trackLog.moduleTime = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    // 查看当前数据是否存在，存在 num + 1， 否则添加
    const todayTrackLog = await this.trackLogReposition.findOneBy({
      moduleName,
      moduleTime: Raw((alias) => `TO_DAYS(${alias}) = TO_DAYS(now())`),
    });
    if (todayTrackLog) {
      await this.trackLogReposition.update(
        {
          id: todayTrackLog.id,
        },
        {
          num: todayTrackLog.num + 1,
        },
      );
    } else {
      trackLog.moduleName = moduleName;
      await this.trackLogReposition.save(trackLog);
    }
    return true;
  }

  /**
   *
   * @returns 查询分组模块数量数据
   */
  async findGroupCount() {
    const groupCountRes: GroupCountRes[] = [];
    // 查询总数
    const totalGroupList = await this.trackLogReposition
      .createQueryBuilder()
      .select('SUM(num)', 'num')
      .addSelect('module_name', 'moduleName')
      .groupBy('module_name')
      .getRawMany<GroupCount>();
    // 查询今天数据
    const todayLogGroupList = await this.trackLogReposition
      .createQueryBuilder()
      .select('SUM(num)', 'num')
      .addSelect('module_name', 'moduleName')
      .where('TO_DAYS(module_time) = TO_DAYS(now())')
      .groupBy('module_name')
      .getRawMany<GroupCount>();

    let total = 0;
    let todayCount = 0;
    totalGroupList.forEach((item) => {
      const todayLogGroup = todayLogGroupList.find(
        (w) => w.moduleName === item.moduleName,
      );
      total += stringToNumber(item.num);
      if (todayLogGroup) {
        todayCount += stringToNumber(todayLogGroup.num);
        groupCountRes.push({
          ...item,
          value: stringToNumber(todayLogGroup.num),
        });
      } else {
        groupCountRes.push({
          ...item,
          value: 0,
        });
      }
    });
    groupCountRes.unshift({
      num: numberToString(total),
      moduleName: '总访问量',
      value: total - todayCount,
    });

    return groupCountRes;
  }

  /**
   *
   * @param range 范围
   * @returns 根据时间范围查询
   */
  async findDateRange(range: number) {
    const { startDate, endDate } = getMysqlStartDateAndEndDate(range);
    const dateRangeList = getDateRangeList(range);
    // 数据库查询
    const trackLog = await this.trackLogReposition.findBy({
      moduleTime: Between(startDate, endDate),
    });
    // 数据整合
    const res: { [prop: string]: Pick<TrackLog, 'moduleTime' | 'num'>[] } = {};
    // 分组
    trackLog.forEach((item) => {
      if (!res[item['moduleName']]) {
        res[item['moduleName']] = [
          {
            ...item,
            moduleTime: dateFormat(item.moduleTime),
          },
        ];
      } else {
        res[item['moduleName']].push({
          ...item,
          moduleTime: dateFormat(item.moduleTime),
        });
      }
    });
    // 填充0
    for (const k in res) {
      dateRangeList.forEach((moduleTime) => {
        const find = res[k].find((w) => w.moduleTime === moduleTime);
        if (!find) {
          res[k].push({
            moduleTime,
            num: 0,
          });
        }
      });
    }
    // 排序
    for (const k in res) {
      res[k].sort(
        (a, b) =>
          new Date(a.moduleTime).getTime() - new Date(b.moduleTime).getTime(),
      );
    }
    return res;
  }
}

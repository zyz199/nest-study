import { existsSync, mkdirSync } from 'fs';
import * as moment from 'moment';
/**
 * 创建文件夹
 * @param filePath 文件路径
 */
export const checkDirAndCreate = (filePath: string) => {
  const pathArr = filePath.split('/');
  let checkPath = '.';
  for (let i = 0; i < pathArr.length; i++) {
    checkPath += `/${pathArr[i]}`;
    if (!existsSync(checkPath)) {
      mkdirSync(checkPath);
    }
  }
};

/**
 *
 * @param src 文件地址
 * @returns 获取文件后缀名
 */
export const getFileSuffix = (src: string) => {
  return src.substring(src.lastIndexOf('.'));
};

/**
 * 类赋值-合并
 * @param oldVal 旧值
 * @param newVal 新值
 */
export function classAssign<T extends object>(oldVal: T, newVal: T): T {
  for (const k in newVal) {
    oldVal[k] = newVal[k];
  }

  return oldVal;
}

/**
 *
 * @param data
 * @returns 列表转树结构
 */
export function listToTree<T extends { id: string; pId: string }>(data: T[]) {
  const obj = {};
  data.forEach((w) => (obj[w.id] = w));
  type TParent = T & { children?: T[] };
  const parentList: TParent[] = [];
  data.forEach((w) => {
    const parent: TParent = obj[w.pId];
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(w);
    } else {
      parentList.push(w);
    }
  });
  return parentList;
}

/**
 *
 * @param val
 * @returns 字符串转数字
 */
export const stringToNumber = (val: string) => {
  return Number(val);
};

/**
 *
 * @param val
 * @returns 数字转字符串
 */
export const numberToString = (val: number) => {
  return String(val);
};

/**
 *
 * @param range
 * @param format
 * @returns 获取 查询mysql开始时间和结束时间
 */
export const getMysqlStartDateAndEndDate = (
  range: number,
  format = 'YYYY-MM-DD',
) => {
  const endDate = moment(new Date()).add(1, 'days').format(format);
  const startDate = moment(new Date())
    .subtract(range - 1, 'days')
    .format(format);
  return {
    startDate,
    endDate,
  };
};

/**
 *
 * @param range
 * @param format
 * @returns 构建时间范围数组
 */
export const getDateRangeList = (range: number, format = 'YYYY-MM-DD') => {
  const list: string[] = [];
  for (let i = 0; i < range; i++) {
    list.push(moment(new Date()).subtract(i, 'days').format(format));
  }
  return list;
};

/**
 *
 * @param date
 * @param format
 * @returns 日期格式化
 */
export const dateFormat = (date: Date | string, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};

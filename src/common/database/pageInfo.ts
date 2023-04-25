/**
 * 分页数据封装
 */
export class BasePage<T> {
  constructor(
    private page: number,
    private pageSize: number,
    private total: number,
    private records: T[],
  ) {}
}

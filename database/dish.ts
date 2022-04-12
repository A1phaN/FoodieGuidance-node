import db from './db';

/**
 * 数据约定：
 *   使用小写便于处理
 *   canteen 表示config中该食堂的序号
 *   start 和 end 表示一天当中的以分计时的时间，为了筛选开放的食堂，这里必须是数字，特殊情况可在 remark 中说明
 *   如果价格不能简单描述 price 表示一个人平均的花费，可在 remark 中说明
 */
db.exec(
  `CREATE TABLE IF NOT EXISTS DISH(
    id       INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
    name     CHAR(30)             NOT NULL,
    img      CHAR(100)            NOT NULL,
    canteen  CHAR(30)             NOT NULL,
    floor    CHAR(30)             NOT NULL,
    window   CHAR(30)             NOT NULL,
    start    INTEGER              NOT NULL,
    end      INTEGER              NOT NULL,
    price    REAL                 NOT NULL,
    remark   CHAR(1000)           NOT NULL,
    reporter CHAR(30)             NOT NULL
  )`
);

const insertDishStatement = db.prepare<Required<Omit<Dish, 'id'>>>(
  `INSERT INTO DISH (name, img, canteen, floor, window, start, end, price, remark, reporter)
  VALUES (@name, @img, @canteen, @floor, @window, @start, @end, @price, @remark, @reporter)`
);

export function insertDish(dish: Dish): boolean {
  const _dish: Required<Omit<Dish, 'id'>> = {
    floor: '',
    window: '',
    remark: '',
    reporter: '',
    ...dish,
  };
  return insertDishStatement.run(_dish).changes == 1;
}

const selectAllDishStatement = db.prepare<{ time: number }>(
  'SELECT * FROM DISH WHERE start<@time AND end>@time'
);

export function selectAllDish(): Dish[] {
  const date = new Date();
  return selectAllDishStatement.all({
    time: date.getMinutes() * 60 + date.getSeconds(),
  });
}

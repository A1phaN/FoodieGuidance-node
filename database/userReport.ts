import db from './db';

// 用户上传的需要经过审核
db.exec(
  `CREATE TABLE IF NOT EXISTS USERREPORT(
    id       INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
    name     CHAR(30)             NOT NULL,
    img      CHAR(100)            NOT NULL,
    canteen  INTEGER              NOT NULL,
    floor    INTEGER              NOT NULL,
    window   CHAR(30)             NOT NULL,
    start    INTEGER              NOT NULL,
    end      INTEGER              NOT NULL,
    price    REAL                 NOT NULL,
    remark   CHAR(1000)           NOT NULL,
    reporter CHAR(30)             NOT NULL
  )`
);

const insertUserReportStatement = db.prepare<Required<Dish>>(
  `INSERT INTO USERREPORT (name, img, canteen, floor, window, start, end, price, remark, reporter)
  VALUES (@name, @img, @canteen, @floor, @window, @start, @end, @price, @remark, @reporter)`
);

export function insertReport(dish: Dish): boolean {
  const _dish: Required<Dish> = {
    floor: '',
    window: '',
    remark: '',
    reporter: '',
    ...dish,
  };
  return insertUserReportStatement.run(_dish).changes == 1;
}

const deleteReportStatement = db.prepare<{ id: number }>('DELETE FROM USERREPORT WHERE ID=@id');

export function deleteReport(id: number): boolean {
  return deleteReportStatement.run({ id }).changes == 1;
}

const approveReportStatement = db.prepare<{ id: number }>(
  `INSERT INTO DISH (name, img, canteen, floor, window, start, end, price, remark, reporter)
    SELECT name, img, canteen, floor, window, start, end, price, remark, reporter
    FROM USERREPORT
    WHERE ID=@id`
);

export function approveReport(id: number): boolean {
  return approveReportStatement.run({ id }).changes == 1 && deleteReport(id);
}

const selectReportStatement = db.prepare<{ id: number }>('SELECT * FROM USERREPORT WHERE ID=@id');

export function selectReport(id: number): Dish | undefined {
  return selectReportStatement.get({ id });
}

const selectAllReportStatement = db.prepare('SELECT * FROM USERREPORT');

export function selectAllReport(): Dish[] {
  return selectAllReportStatement.all();
}

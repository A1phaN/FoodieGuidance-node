import type { NextApiRequest, NextApiResponse } from 'next';
import { rmSync } from 'fs';

import { PUBLIC_PATH } from '../../config';
import { deleteReport, approveReport, selectReport, insertDish } from '../../database';

interface AuditReportRequestBody {
  id: number;
  approve: boolean;
  dish?: Partial<Dish>;
}

const handler = (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  if (req.method !== 'POST' || typeof req.body.id !== 'number') {
    return res.status(400).send({ code: 1 });
  }

  const { id, approve, dish } = req.body as AuditReportRequestBody;
  const report = selectReport(id);
  if (!report) {
    return res.status(404).send({ code: 1, msg: 'report not found' });
  }
  if (!approve) {
    rmSync(`${PUBLIC_PATH}/${report.img}`);
    deleteReport(id);
  } else if (dish) {
    insertDish({
      ...report,
      ...dish
    });
    deleteReport(id);
  } else {
    approveReport(id);
  }
  res.send({ code: 0 });
};

export default handler;

import type { NextApiRequest, NextApiResponse } from 'next';

import { selectAllReport } from '../../database';

const handler = (req: NextApiRequest, res: NextApiResponse<ApiResponse<Dish[]>>) => {
  if (req.method !== 'GET') {
    return res.status(400).send({ code: 1 });
  }

  res.send({
    code: 0,
    data: selectAllReport(),
  });
};

export default handler;

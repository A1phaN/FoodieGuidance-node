import type { NextApiRequest, NextApiResponse } from 'next';

import { selectAllDish } from '../../database';

const handler = (req: NextApiRequest, res: NextApiResponse<ApiResponse<Dish>>) => {
  if (req.method !== 'GET') {
    return res.status(400).send({ code: 1 });
  }

  const dish = selectAllDish();
  res.send({
    code: 0,
    data: dish[Math.floor(Math.random() * dish.length)],
  });
};

export default handler;

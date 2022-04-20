import type { NextApiRequest, NextApiResponse } from 'next';

import { selectAllDish } from '../../database';

export function getRandomDish(): Dish {
  const dish = selectAllDish();
  return dish[Math.floor(Math.random() * dish.length)];
}

const handler = (req: NextApiRequest, res: NextApiResponse<ApiResponse<Dish>>) => {
  if (req.method !== 'GET') {
    return res.status(400).send({ code: 1 });
  }

  res.send({
    code: 0,
    data: getRandomDish(),
  });
};

export default handler;

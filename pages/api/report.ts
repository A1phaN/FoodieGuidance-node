import type { NextApiRequest, NextApiResponse } from 'next';
import { mkdirSync, renameSync } from 'fs';
import formidable from 'formidable';
import { nanoid } from 'nanoid';

import { insertReport } from '../../database';
import { PUBLIC_PATH } from '../../config';

mkdirSync(PUBLIC_PATH, { recursive: true });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  if (req.method !== 'POST') {
    return res.status(400).send({ code: 1 });
  }

  const form = new formidable.IncomingForm({ uploadDir: PUBLIC_PATH });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).send({ code: -1 });
    }

    let ranges: { start: number; end: number }[];
    try {
      ranges = typeof fields.ranges === 'string' ? JSON.parse(fields.ranges) : [];
    } catch (e) {
      ranges = [];
    }

    if (
      typeof fields.name !== 'string' ||
      typeof fields.canteen !== 'string' ||
      (fields.floor && typeof fields.floor !== 'string') ||
      (fields.window && typeof fields.window !== 'string') ||
      !Array.isArray(ranges) ||
      ranges.length < 1 ||
      ranges.some(range => typeof range.start !== 'number' || typeof range.end !== 'number') ||
      typeof fields.price !== 'string' ||
      (fields.remark && typeof fields.remark !== 'string') ||
      (fields.reporter && typeof fields.reporter !== 'string') ||
      !files?.img ||
      Array.isArray(files.img)
    ) {
      return res.status(400).send({ code: 1 });
    }

    const { img: file } = files;
    const img = `${nanoid()}.${file.originalFilename?.split('.').at(-1)}`;
    renameSync(file.filepath, `${PUBLIC_PATH}/${img}`);

    const dish: Parameters<typeof insertReport>[0] = {
      name: fields.name,
      img,
      canteen: fields.canteen,
      floor: fields.floor,
      window: fields.window,
      start: 0,
      end: 0,
      price: Number(fields.price),
      remark: fields.remark,
      reporter: fields.reporter,
    };

    if (Object.is(NaN, dish.price)) {
      return res.status(400).send({ code: 1 });
    }

    ranges.forEach(range =>
      insertReport({
        ...dish,
        start: range.start,
        end: range.end,
      })
    );

    res.send({ code: 0 });
  });
};

export default handler;

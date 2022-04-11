import type { NextApiRequest, NextApiResponse } from 'next';
import { renameSync } from 'fs';
import formidable from 'formidable';
import { nanoid } from 'nanoid';

import { insertReport } from '../../database';
import { PUBLIC_PATH } from '../../config';

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

    if (
      typeof fields.name !== 'string' ||
      typeof fields.canteen !== 'string' ||
      (fields.floor && typeof fields.floor !== 'string') ||
      (fields.window && typeof fields.window !== 'string') ||
      typeof fields.start !== 'string' ||
      typeof fields.end !== 'string' ||
      typeof fields.price !== 'string' ||
      (fields.remark && typeof fields.remark !== 'string') ||
      (fields.reporter && typeof fields.reporter !== 'string') ||
      !files?.img || Array.isArray(files.img)
    ) {
      return res.status(400).send({ code: 1 });
    }

    const { img: file } = files;
    const img = `${nanoid()}.${file.originalFilename?.split('.').at(-1)}`;
    renameSync(file.filepath, `${PUBLIC_PATH}/${img}`);

    insertReport({
      name: fields.name,
      img,
      canteen: fields.canteen,
      floor: fields.floor,
      window: fields.window,
      start: fields.start,
      end: fields.end,
      price: Number(fields.price),
      remark: fields.remark,
      reporter: fields.reporter,
    });
    res.send({ code: 0 });
  });
};

export default handler;

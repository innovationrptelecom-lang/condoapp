
import nextConnect from 'next-connect';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';

const s3 = new S3Client({ region: process.env.AWS_REGION });

const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error(error);
    res.status(501).json({ error: `Upload error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const { entityId } = req.body;
  const buffer = req.file.buffer;
  const key = `uploads/${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: req.file.mimetype,
    })
  );

  const attachment = await prisma.attachment.create({
    data: {
      entityType: 'call',
      entityId: Number(entityId),
      filePath: key,
    },
  });

  res.status(201).json(attachment);
});

export const config = { api: { bodyParser: false } };
export default apiRoute;

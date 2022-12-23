import * as dotenv from 'dotenv';
import * as env from 'env-var';
import * as Minio from 'minio';
import * as fs from 'fs';
import express from 'express';
import multer from 'multer';

dotenv.config();

const port = env.get('PORT').default('3000').asPortNumber();
const s3UseSSL = env.get('S3_USE_SSL').default('false').asBool();
const s3Endpoint = env.get('S3_ENDPOINT').required().asString();
const s3Port = env.get('S3_PORT').default('9000').asPortNumber();
const s3AccessKey = env.get('S3_ACCESS_KEY').required().asString();
const s3SecretKey = env.get('S3_SECRET_KEY').required().asString();
const s3Bucket = env.get('S3_BUCKET').required().asString();
const appPath = env.get('APP_PATH').required().asString();

const app = express();

const minioClient = new Minio.Client({
  endPoint: s3Endpoint,
  port: s3Port,
  useSSL: s3UseSSL,
  accessKey: s3AccessKey,
  secretKey: s3SecretKey,
});

const upload = multer({
  storage: multer.diskStorage({}),
});

async function streamToArray<T>(stream: Minio.BucketStream<T>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const result: T[] = [];
    stream.on('data', (datum) => result.push(datum));
    stream.on('end', () => resolve(result));
    stream.on('close', () => resolve(result));
    stream.on('error', (error) => reject(error));
  });
}

// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.log(err);
    res.status(500).end('Internal server error');
  }
);

// Server
app.get('/files', async (_req, res) => {
  const stream = await minioClient.listObjectsV2(s3Bucket, '', false);
  const result = await streamToArray(stream);
  res.json(result);
});

app.post('/upload/:filename', upload.single('file'), async (req, res) => {
  if (req.file) {
    const result = await minioClient.putObject(
      s3Bucket,
      req.params.filename,
      fs.createReadStream(req.file.path)
    );
    res.json(result);
  } else {
    res.status(400).end('Bad request');
  }
});

app.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  const presignedUrl = await minioClient.presignedGetObject(s3Bucket, filename);
  res.redirect(presignedUrl);
});

app.post('/delete/:filename', async (req, res) => {
  const result = await minioClient.removeObject(s3Bucket, req.params.filename);
  res.status(200).end();
});

// Client
app.use('/app', express.static(appPath));
app.get('/', (_req, res) => {
  res.redirect('/app');
});

console.log(`Listening on port ${port}`);
app.listen(port);

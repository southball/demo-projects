import express from 'express';
import * as dotenv from 'dotenv';
import * as env from 'env-var';
import * as Minio from 'minio';

dotenv.config();

const port = env.get('PORT').default('3000').asPortNumber();
const s3UseSSL = env.get('S3_USE_SSL').default('false').asBool();
const s3Endpoint = env.get('S3_ENDPOINT').required().asString();
const s3Port = env.get('S3_PORT').default('9000').asPortNumber();
const s3AccessKey = env.get('S3_ACCESS_KEY').required().asString();
const s3SecretKey = env.get('S3_SECRET_KEY').required().asString();
const s3Bucket = env.get('S3_BUCKET').required().asString();

const app = express();

const minioClient = new Minio.Client({
  endPoint: s3Endpoint,
  port: s3Port,
  useSSL: s3UseSSL,
  accessKey: s3AccessKey,
  secretKey: s3SecretKey,
});

async function consumeStream<T>(stream: Minio.BucketStream<T>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const result: T[] = [];
    stream.on('data', (datum) => result.push(datum));
    stream.on('end', () => resolve(result));
    stream.on('close', () => resolve(result));
    stream.on('error', (error) => reject(error));
  });
}

app.get('/files', async (req, res) => {
  const stream = await minioClient.listObjectsV2(s3Bucket, '', false);
  const result = await consumeStream(stream);
  res.json(result);
});

console.log(`Listening on port ${port}`);
app.listen(port);

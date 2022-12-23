## How to run

```bash
docker build -t minio-simple .
docker compose up minio -d
cp .env.sample .env
# Create bucket and access key, and edit .env as appropriate.
docker compose up
```

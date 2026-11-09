let minioClient = null;

try {
  const Minio = require('minio');
  minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
    secretKey: process.env.MINIO_SECRET_KEY || 'admin123'
  });

  const BUCKET = process.env.MINIO_BUCKET || 'delivery-proofs';

  async function ensureBucket() {
    try {
      const exists = await minioClient.bucketExists(BUCKET);
      if (!exists) {
        await minioClient.makeBucket(BUCKET);
        console.log(`✅ MinIO Bucket created: ${BUCKET}`);
      }
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET}/*`]
          }
        ]
      };
      await minioClient.setBucketPolicy(BUCKET, JSON.stringify(policy));
    } catch (err) {
      console.warn(`MinIO bucket init check for ${BUCKET}:`, err.message);
    }
  }

  ensureBucket();
} catch (e) {
  console.warn('⚠️ MinIO fallback active:', e.message);
}

module.exports = { minioClient, BUCKET: process.env.MINIO_BUCKET || 'delivery-proofs' };

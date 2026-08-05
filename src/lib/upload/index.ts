import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ─── S3 Client Configuration ─────────────────────────
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'orpind-uploads';
const CDN_URL = process.env.CDN_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`;

interface UploadResult {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

interface UploadOptions {
  folder: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

// ─── Upload File to S3 ───────────────────────────────
export async function uploadFile(
  file: Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  options: UploadOptions
): Promise<UploadResult> {
  const key = `${options.folder}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  return {
    url: `${CDN_URL}/${key}`,
    key,
    size: file.length,
    contentType,
  };
}

// ─── Delete File from S3 ─────────────────────────────
export async function deleteFile(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}

// ─── Generate Presigned URL for Direct Upload ────────
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: string,
  expiresIn = 3600
): Promise<{ uploadUrl: string; key: string }> {
  const key = `${folder}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return { uploadUrl, key };
}

// ─── Generate Presigned URL for Viewing ──────────────
export async function getPresignedViewUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

// ─── Validate Image File ─────────────────────────────
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }
  return { valid: true };
}

// ─── Process Image (Resize) ──────────────────────────
export async function processImage(
  buffer: Buffer,
  options: { width?: number; height?: number; quality?: number } = {}
): Promise<Buffer> {
  // In production, use sharp library for image processing
  // This is a placeholder that returns the original buffer
  return buffer;
}

// ─── Upload Product Image ────────────────────────────
export async function uploadProductImage(
  file: Buffer,
  productId: string,
  fileName: string,
  isMain = false
): Promise<UploadResult> {
  const folder = isMain ? `products/main` : `products/gallery`;
  const contentType = getContentType(fileName);

  return uploadFile(file, `${productId}-${fileName}`, contentType, {
    folder,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 5,
  });
}

// ─── Upload User Avatar ──────────────────────────────
export async function uploadUserAvatar(
  file: Buffer,
  userId: string,
  fileName: string
): Promise<UploadResult> {
  return uploadFile(file, `avatars/${userId}-${fileName}`, getContentType(fileName), {
    folder: 'avatars',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 2,
  });
}

// ─── Upload Blog Image ───────────────────────────────
export async function uploadBlogImage(
  file: Buffer,
  blogId: string,
  fileName: string
): Promise<UploadResult> {
  return uploadFile(file, `${blogId}-${fileName}`, getContentType(fileName), {
    folder: 'blog',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 10,
  });
}

// ─── Helper: Get Content Type ────────────────────────
function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

// ─── Batch Delete Files ──────────────────────────────
export async function batchDeleteFiles(keys: string[]): Promise<{ deleted: number; failed: number }> {
  let deleted = 0;
  let failed = 0;

  for (const key of keys) {
    const success = await deleteFile(key);
    if (success) deleted++;
    else failed++;
  }

  return { deleted, failed };
}

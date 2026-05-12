import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
})

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    // Validación de tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Solo imágenes JPG/PNG permitidas',
      }
    }

    // Validación de tamaño
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: 'Máximo 5MB permitido',
      }
    }

    // Generar key única
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const key = `products/${timestamp}-${randomString}.${extension}`

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir a R2
    await S3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const url = `${R2_PUBLIC_URL}/${key}`

    return {
      success: true,
      url,
      key,
    }
  } catch (error) {
    console.error('Error uploading to R2:', error)
    return {
      success: false,
      error: 'Error al subir la imagen',
    }
  }
}

export async function deleteImage(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    await S3.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    )

    return { success: true }
  } catch (error) {
    console.error('Error deleting from R2:', error)
    return {
      success: false,
      error: 'Error al eliminar la imagen',
    }
  }
}

export function getPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`
}

export function extractKeyFromUrl(url: string): string | null {
  if (!url.startsWith(R2_PUBLIC_URL!)) {
    return null
  }
  return url.replace(`${R2_PUBLIC_URL}/`, '')
}

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const getFromS3=async(filename,expiresIn=600)=>{
  return  await getSignedUrl(
    s3,
    new GetObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        key:filename,
    }),
    {expiresIn}
  )
}
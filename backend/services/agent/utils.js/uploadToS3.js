import { PutObjectCommand, s3 } from "@aws-sdk/client-s3"

export const uploadToS3= async (filename,buffer,contentType)=>{
  await s3.send(
     new PutObjectCommand(
         {Bucket:process.env.AWS_BUCJET_NAME,
            Body:buffer,
            Key:filename,
            ContentType:contentType

         }
     )
  )
  return filename
}
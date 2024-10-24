import fs from "fs"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import r2 from "../utils/r2.js";
const fileUploader = async (
    fileName,
    filePath,
    convert
) => {
  // Read the file from the local filesystem
  const fileBuffer = fs.readFileSync(filePath)

const signedUrl = await getSignedURL(fileName)

  console.log('response url', signedUrl)

  const uploaded = await fetch(signedUrl, {
    method: 'PUT',
    body: fileBuffer,
  })

  console.log('uploaded', uploaded)
}

const getSignedURL = async (fileName) => {
  try {
    console.log("Generating an upload URL!");

    const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: "hola",
          Key: fileName,
        }),
        { expiresIn: 60 },
    );

    console.log("signed url", signedUrl);
    console.log("Success generating upload URL!");
    return signedUrl
  } catch (err) {
    console.log("error", err);
  }
}

export default fileUploader
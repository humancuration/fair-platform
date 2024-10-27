import { writeAsyncIterableToWritable } from "@remix-run/node";
import type { UploadHandler } from "@remix-run/node";
import { prisma } from "./db.server";

export const uploadHandler: UploadHandler = async ({ name, contentType, data }) => {
  if (name !== "file") {
    return undefined;
  }

  const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${uploadDir}/${filename}`;

  try {
    const writeStream = require("fs").createWriteStream(path);
    await writeAsyncIterableToWritable(data, writeStream);

    const upload = await prisma.upload.create({
      data: {
        filename,
        contentType,
        path: `/uploads/${filename}`,
      },
    });

    return upload.path;
  } catch (error) {
    console.error("Upload error:", error);
    return undefined;
  }
};

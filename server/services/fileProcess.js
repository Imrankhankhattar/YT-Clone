const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const urljoin = require("url-join");

const config = require("../config");
const googleStore = require("./fileStorage");
const errorResponse = require("../utils/error");

const localVidPath = path.join(__dirname, "../", "data", "videos");
const localThumbPath = path.join(__dirname, "../", "data", "thumbnails");

const getPath = async ({ type, filename = "" }) => {
  const pathDir = type === "video" ? localVidPath : localThumbPath;
  try {
    const isDirExist = await checkFileExists({ type, filename: "" });

    if (!isDirExist) {
      await fs.promises.mkdir(pathDir, { recursive: true });
    }
  } finally {
    return path.join(pathDir, filename);
  }
};

const streamVideo = async ({ videoFile, range, res }) => {
  try {
    const videoPath = await getPath({ type: "video", filename: videoFile });
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (err) {
    errorResponse(err, res);
  }
};

const sendImage = async ({ filename, res }) => {
  //TODO: need getPath function that creates path if dont exist
  const filePath = await getPath({ type: "thumbnail", filename });
  res.sendFile(filePath, function (err) {
    if (err) {
      errorResponse(
        {
          name: "FileError",
          message: "File do not exist",
        },
        res
      );
    }
  });
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await getPath({ type: "video" });
    cb(null, localVidPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".mp4") {
    return cb({ message: "Only .mp4 allowed" });
  }
  cb(null, true);
};
const uploadFile = multer({ storage, fileFilter: uploadFilter }).single("file");

const generateThumbnails = async (videoFile, limit) => {
  const videoPath = await getPath({ type: "video", filename: videoFile });
  let thumbnailLinks;
  const promise = new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on("filenames", function (filenames) {
        thumbnailLinks = filenames.map((filename) => {
          const link = generateLink({ filename, type: "thumbnail" });
          return { filename, link };
        });
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", function () {
        resolve(thumbnailLinks);
      })
      .screenshots({
        count: limit,
        folder: localThumbPath,
        size: "1280x720",
        filename: "thumbnail_%b.png",
      });
  });
  return promise;
};

const generateLink = ({ filename, type }) => {
  const url = type === "video" ? "/api/videos/stream" : "/api/videos/thumbnail";
  return urljoin(config.BACKEND_URL, url, encodeURIComponent(filename));
};
const videoInfo = async (filename) => {
  const videoPath = await getPath({ type: "video", filename });
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, function (err, metadata) {
      if (err) {
        reject(err);
      } else {
        // Convert duration from seconds to MM:SS format
        const durationInSeconds = metadata.format.duration;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        resolve({ duration: formattedDuration });
      }
    });
  });
};

const storeFile = async ({ filename, type }) => {
  const filePath =
    type === "video"
      ? await getPath({ type: "video", filename })
      : await getPath({ type: "thumbnail", filename });
  const mimeType = type === "video" ? "video/mp4" : "image/png";

  try {
    const results = await googleStore.saveFile({
      filePath,
      filename,
      mimeType,
    });
    return results;
  } catch (err) {
    console.log(`Google Drive storage failed for ${filename}:`, err.message);
    console.log("Falling back to local storage...");
    
    // Check if file exists locally before proceeding
    const fileExists = await checkFileExists({ type, filename });
    if (!fileExists) {
      throw new Error(`File ${filename} not found locally. Upload may have failed.`);
    }
    
    // Fallback to local storage - return a mock ID
    return { id: `local-${Date.now()}-${filename}` };
  }
};

const getStoreFile = async ({ fileStoreId, type }) => {
  // If it's a local storage ID, skip Google Drive
  if (fileStoreId && fileStoreId.startsWith('local-')) {
    console.log(`Skipping Google Drive for local file: ${fileStoreId}`);
    return true;
  }
  
  const path =
    type === "video"
      ? await getPath({ type: "video" })
      : await getPath({ type: "thumbnail" });
  try {
    const results = await googleStore.getFile({
      fileId: fileStoreId,
      pathDir: path,
    });
    return results;
  } catch (err) {
    console.log(`Error getting store file ${fileStoreId}:`, err.message);
    return false;
  }
};
const checkFileExists = async ({ type, filename }) => {
  const file =
    type === "video"
      ? path.join(localVidPath, filename)
      : path.join(localThumbPath, filename);
  try {
    await fs.promises.access(file, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  streamVideo,
  uploadFile,
  generateThumbnails,
  generateLink,
  videoInfo,
  storeFile,
  checkFileExists,
  getStoreFile,
  sendImage,
};

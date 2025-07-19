import axios from "axios";
import { BACKEND_URL } from "../../config";
import { getHomeVideos } from "./videos";

const api = axios.create({
  withCredentials: true,
  baseURL: BACKEND_URL,
});

const setModal = (isOpen) => {
  return {
    type: "SET_MODAL",
    payload: { isOpen },
  };
};

const setLoading = (isLoading) => {
  return {
    type: "SET_LOADING",
    payload: { isLoading },
  };
};

const setUploading = (isUploading) => {
  return {
    type: "SET_UPLOADING",
    payload: { isUploading },
  };
};

const setVideoFile = (filename) => {
  return {
    type: "SET_VIDEO_FILE",
    payload: { filename },
  };
};

const setThumbnails = (thumbnails) => {
  return {
    type: "SET_THUMBNAILS",
    payload: { thumbnails },
  };
};

const setThumbnail = (thumbnailFilename) => {
  return {
    type: "SET_THUMBNAIL",
    payload: { thumbnailFilename },
  };
};

const setDetails = (details) => {
  return {
    type: "SET_DETAILS",
    payload: { details },
  };
};

const setVisibility = (visibility) => {
  return {
    type: "SET_VISIBILITY",
    payload: { visibility },
  };
};

const resetUpload = () => {
  return {
    type: "RESET_UPLOAD",
  };
};

const uploadVideo = (file) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      let formData = new FormData();
      const config = {
        header: { "content-type": "multipart/form-data" },
      };
      formData.append("file", file);
      const { data: video } = await api.post("/api/videos", formData, config);
      const filename = video.filename;
      dispatch(setVideoFile(filename));
      const { data } = await api.post("/api/videos/thumbnails", {
        filename,
      });
      dispatch(setThumbnails(data.thumbnails));
    } catch (err) {
      dispatch(setVideoFile(null));
      dispatch(setThumbnails(null));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

const setVisibilitySubmit = (visibility) => {
  return async (dispatch) => {
    dispatch(setVisibility(parseInt(visibility)));
    dispatch(uploadVideoInfo());
  };
};
const uploadVideoInfo = () => {
  return async (dispatch, getState) => {
    const {
      thumbnailFilename,
      details,
      visibility,
      filename,
    } = getState().upload;
    const { id: uploader } = getState().channel;
    
    console.log("Uploading video info:", {
      filename,
      thumbnailFilename,
      visibility,
      uploader,
      details,
    });
    
    // Set uploading state to show loader
    dispatch(setUploading(true));
    
    try {
      const response = await api.post("/api/videos/upload", {
        filename,
        thumbnailFilename,
        visibility,
        uploader,
        ...details,
      });
      
      console.log("Upload successful:", response.data);
      dispatch(resetUpload());
      
      // Refresh the video list to show the new video
      dispatch(getHomeVideos());
      
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      // You could dispatch an error action here to show user feedback
    } finally {
      // Clear uploading state
      dispatch(setUploading(false));
    }
  };
};

export {
  setModal,
  resetUpload,
  uploadVideo,
  setThumbnail,
  setDetails,
  setVisibility,
  uploadVideoInfo,
  setVisibilitySubmit,
  setUploading,
};

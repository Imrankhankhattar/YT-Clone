import React from "react";
import { makeStyles, Typography, CircularProgress, Box } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    minHeight: "200px",
  },
  progressContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  circularProgress: {
    color: theme.palette.primary.main,
  },
  uploadIcon: {
    fontSize: "3rem",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    animation: "$bounce 2s infinite",
  },
  title: {
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  subtitle: {
    color: theme.palette.text.secondary,
    textAlign: "center",
    maxWidth: "300px",
  },
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-10px)",
    },
    "60%": {
      transform: "translateY(-5px)",
    },
  },
}));

export default function UploadLoader({ stage = "uploading" }) {
  const classes = useStyles();

  const getStageContent = () => {
    switch (stage) {
      case "processing":
        return {
          title: "Processing Your Video",
          subtitle: "Please wait while we generate thumbnails and process your video file...",
        };
      case "uploading":
      default:
        return {
          title: "Uploading Your Video",
          subtitle: "Please wait while we save your video to our database. This may take a few moments...",
        };
    }
  };

  const content = getStageContent();

  return (
    <Box className={classes.loaderContainer}>
      <CloudUpload className={classes.uploadIcon} />
      
      <div className={classes.progressContainer}>
        <CircularProgress 
          size={60} 
          thickness={4} 
          className={classes.circularProgress}
          disableShrink
        />
      </div>
      
      <Typography variant="h6" className={classes.title}>
        {content.title}
      </Typography>
      
      <Typography variant="body2" className={classes.subtitle}>
        {content.subtitle}
      </Typography>
    </Box>
  );
} 
import React from "react";
import { useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import VidDropzone from "./VidDropzone";

import UploadStepper from "./UploadStepper";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function CustomizedDialogs({ isOpen, handleClose }) {
  const filename = useSelector(({ upload }) => upload.filename);
  const isUploading = useSelector(({ upload }) => upload.isUploading);
  const isLoading = useSelector(({ upload }) => upload.isLoading);

  // Don't allow closing when uploading or loading
  const canClose = !isUploading && !isLoading;

  return (
    <Dialog
      onClose={canClose ? handleClose : undefined}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      disableEscapeKeyDown={!canClose}
      disableBackdropClick={!canClose}
    >
      <DialogTitle id="customized-dialog-title" onClose={canClose ? handleClose : undefined}>
        Upload video
      </DialogTitle>
      <DialogContent dividers>
        {filename ? <UploadStepper /> : <VidDropzone />}
      </DialogContent>
    </Dialog>
  );
}

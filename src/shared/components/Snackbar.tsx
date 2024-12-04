// src/shared/components/Snackbar.tsx

import React from "react";
import { Snackbar as MuiSnackbar, Alert, SnackbarCloseReason, SnackbarProps } from "@mui/material";

interface CustomSnackbarProps extends SnackbarProps {
  message: string;
  severity?: "success" | "error" | "info" | "warning";
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ message, severity = "success", open, onClose, ...props }) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    // Si reason est undefined ou "clickaway", on ne fait rien.
    if (reason === "clickaway" || !reason) {
      return;
    }
    if (onClose) onClose(event, reason);
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      {...props}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default CustomSnackbar;

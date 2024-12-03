import React, { FC } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface MatchModalProps {
    open: boolean;
    playerOneName: string;
    playerTwoName: string;
    onClose: () => void;
    onStartGame: () => void;
  }  

const MatchModal: FC<MatchModalProps> = ({ open, playerOneName, playerTwoName, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Match en cours</DialogTitle>
      <DialogContent>
        <Typography variant="h6">
          {playerOneName} <strong>vs</strong> {playerTwoName}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Commencer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchModal;

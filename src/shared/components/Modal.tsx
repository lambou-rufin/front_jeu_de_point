import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { ModalProps } from '../models/interface';


const ModalComponent: React.FC<ModalProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
}) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        <Typography mb={4}>{message}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button variant="outlined" onClick={onCancel} color="error">
            {cancelText}
          </Button>
          <Button variant="outlined" onClick={onConfirm} color="primary">
            {confirmText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalComponent;

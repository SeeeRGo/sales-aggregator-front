import { Box, Modal, Stack, Typography } from '@mui/material';
import React from 'react'

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface IProps {
  open: boolean
  handleClose: () => void
  children: React.ReactNode
}

export const DuplicateMessages: React.FC<IProps> = ({ open, handleClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Stack rowGap={1} alignItems='center'>
          <Typography variant='h6'>Найдены потенциальные копии</Typography>
          {children}
        </Stack>
      </Box>
    </Modal>
  )
}
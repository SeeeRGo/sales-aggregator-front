import { IMessage } from '@/types';
import { Box, Card, Modal, Stack, Typography } from '@mui/material';
import React from 'react'
import { FormattedMessage } from './FormattedMessage';
import { useStore } from 'effector-react';
import { $searchQuery, $searchResults } from '@/store/messages';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  height: '95%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

interface IProps {
  open: boolean
  handleClose: () => void
}

export const SearchResults: React.FC<IProps> = ({ open, handleClose }) => {
  const searchResults = useStore($searchResults)
  const searchQuery = useStore($searchQuery)
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-search"
      aria-describedby="modal-search-results"
    >
      <Box sx={modalStyle}>
        <Stack rowGap={1} alignItems='center'>
          <Typography variant='h6'>Результаты поиска</Typography>
          <Stack rowGap={1}>
            <Card>{searchQuery}</Card>
            <Stack>
              {searchResults.map(message => <FormattedMessage key={message.messageId} message={message} />)}
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}
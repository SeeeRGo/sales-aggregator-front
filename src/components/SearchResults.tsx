import { IMessage } from '@/types';
import { Box, Card, Grid, Modal, Stack, Typography } from '@mui/material';
import React from 'react'
import { FormattedMessage } from './FormattedMessage';
import { useStore } from 'effector-react';
import { $searchQuery, $searchResults } from '@/store/messages';
import { Close } from './Close';
import { removeMessageFromSearchResults } from '@/effects/search';

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
  overflow: 'scroll',
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
          <div>
            <Typography variant='h6'>Результаты поиска</Typography>
            <Close onClose={handleClose} />
          </div>
          <Stack sx={{ width: '100%'}} rowGap={1}>
            <Card>{searchQuery}</Card>
            <Grid container flex={1} rowGap={2}>
              {searchResults.map(message => (
                <Grid item xs={12} sm={6} md={3} key={message.messageId}>
                  <div style={{ margin: 8 }}>
                    <FormattedMessage  
                    message={message} 
                    ignoreDuplicates
                    onStatusChange={() => {
                      removeMessageFromSearchResults(message)
                    }}
                    onClose={() => {
                      removeMessageFromSearchResults(message)
                    }} />
                  </div>
                </Grid>
              ))}
            </Grid>
            <Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}
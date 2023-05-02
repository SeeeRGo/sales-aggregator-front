import { IMessage } from '@/types'
import { Card, Grid, Typography } from '@mui/material'
import React from 'react'
import { FormattedMessage } from './FormattedMessage'

interface IProps {
  chats: IMessage[][]
}
export const MessageGrid = ({ chats }: IProps) => {
  return (
    <Grid container columnSpacing={2} direction="row">
      {chats.map((chatMessages, colIndex) => (
        <Grid
          item
          xs={3}
          rowSpacing={2}
          container
          direction="column"
          key={colIndex}
        >
          {chatMessages.map((message, i) => (
            <Grid item key={i}>
              <FormattedMessage message={message} />
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}
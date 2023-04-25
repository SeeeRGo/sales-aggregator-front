import { IMessage } from '@/types'
import { Card, Grid, Typography } from '@mui/material'
import React from 'react'
import { FormattedMessage } from './FormattedMessage'

interface IProps {
  chats: IMessage[][]
  titles: string[]
}
export const MessageGrid = ({ chats, titles }: IProps) => {
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
          <Typography variant='h6'>Канал: {titles[colIndex]}</Typography>
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
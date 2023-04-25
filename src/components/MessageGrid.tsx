import { IMessage } from '@/types'
import { Card, Grid } from '@mui/material'
import React from 'react'

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
          {chatMessages.map((message: any, i: number) => (
            <Grid item key={i}>
              <Card>
                {message.date},{message.text}
              </Card>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}
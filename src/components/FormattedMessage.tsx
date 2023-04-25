import { IMessage } from '@/types'
import { ArchiveOutlined, Check, Close, Delete, QuestionMark } from '@mui/icons-material'
import { Card, CardActions, CardContent, IconButton } from '@mui/material'
import dayjs from 'dayjs'
import React, { useState } from 'react'

interface IProps {
  message: IMessage
}

enum MessageStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INTERESTING = 'INTERESTING',
}
enum ProcessStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  DELETED = 'DELETED'
}


export const FormattedMessage = ({ message }: IProps) => {
  const [status, setStatus] = useState(MessageStatus.PENDING)
  const [processStatus, setProcessStatus] = useState(ProcessStatus.PENDING)
  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          {dayjs.unix(message.date).format('DD.MM.YYYY HH:MM')}
        </div>
        <div>
          {message.text}
        </div>
        <div>
          {status} / {processStatus}
        </div>
      </div>
      <div>
        <IconButton onClick={() => setStatus(MessageStatus.APPROVED)}>
          <Check color='success' />
        </IconButton>
        <IconButton onClick={() => setStatus(MessageStatus.REJECTED)}>
          <Close color='error' />
        </IconButton>
        <IconButton onClick={() => setStatus(MessageStatus.INTERESTING)}>
          <QuestionMark />
        </IconButton>
        <IconButton onClick={() => setProcessStatus(ProcessStatus.PROCESSED)}>
          <ArchiveOutlined color='primary' />
        </IconButton>
        <IconButton onClick={() => setProcessStatus(ProcessStatus.DELETED)}>
          <Delete color='secondary' />
        </IconButton>
      </div>
    </Card>
  )
}
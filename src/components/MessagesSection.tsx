import { IMessage } from '@/types'
import { Chip, Divider, ListSubheader } from '@mui/material'
import React from 'react'
import { MessageGrid } from './MessageGrid'

interface IProps {
  messages: IMessage[]
  sectionLabel: string
}

export const MessageSection: React.FC<IProps> = ({ messages, sectionLabel }) => {
  return (
    <>
      <ListSubheader component={"div"}>
        <Divider style={{ marginBottom: "12px" }}>
          <Chip label={sectionLabel} />
        </Divider>
      </ListSubheader>
      <MessageGrid chatMessages={messages} />
    </>
  );
}
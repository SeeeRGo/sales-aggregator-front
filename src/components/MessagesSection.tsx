import { IMessage } from '@/types'
import { Chip, Divider, ListSubheader } from '@mui/material'
import React, { useState } from 'react'
import { MessageGrid } from './MessageGrid'
import { RowVirtualizerDynamic } from '@/playground/tanstackGrid'

interface IProps {
  messages: IMessage[]
}

export const MessageSection: React.FC<IProps> = ({ messages }) => {
  const [sectionLabel, setSectionLabel] = useState("");
  return (
    <div style={{ width: "95vw" }}>
      <ListSubheader sx={{ top: 48, backgroundColor: "primary.light" }}>
        <Divider style={{ marginBottom: "12px" }}>
          <Chip label={sectionLabel} />
        </Divider>
      </ListSubheader>
      <RowVirtualizerDynamic rows={messages} headerText={sectionLabel} setHeaderText={setSectionLabel} />
    </div>
  );
}
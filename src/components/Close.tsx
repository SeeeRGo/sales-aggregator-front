import { HighlightOff } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'

interface IProps {
  onClose: () => void

}
export const Close = ({ onClose }: IProps) => {
  return (
      <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={onClose}><HighlightOff color='error' /></IconButton>
  )
}
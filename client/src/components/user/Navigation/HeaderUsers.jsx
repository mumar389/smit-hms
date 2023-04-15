import { Typography } from '@mui/material'
import React from 'react'

const HeaderUsers = (props) => {
  return (
    <>
    <Typography sx={{
      position: 'relative',
      width: '50%',
      height: '20px',
      left: '100px',
      top: '50px',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontHeight: '600',
      fontSize: '40px',
      lineHeight: '30px',
      color: '#FFFFFF',
}}>
      {props.name}
    </Typography>
    </>
  )
}

export default HeaderUsers


import { Box } from '@mui/material';
import React from 'react'

const StatusStyle = ({status}) => {
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
          case 'approved':
          case 'active':
            return { bgcolor: '#4caf50', color: '#fff' };
          case 'rejected':
          case 'inactive':
            return { bgcolor: '#f44336', color: '#fff' };
          default:
            return { bgcolor: '#bdbdbd', color: '#000' };
        }
    };

    return (
        <Box
            sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600,
                bgcolor: getStatusStyles(status).bgcolor,
                color: getStatusStyles(status).color,
                textTransform: 'capitalize',
            }}
            >
            {status}
        </Box>
    )
}

export default StatusStyle;
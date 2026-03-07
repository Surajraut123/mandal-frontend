import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import StatusStyle from '../statusStyleDialog/StatusStyle';

export default function ConfirmationDialog({dialogOpen, setUserAgreed, setDialogOpen, statusData}) {
  const [open, setOpen] = React.useState(dialogOpen);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  React.useEffect(() => {
    setOpen(dialogOpen);
  }, [dialogOpen]);
  const handleClose = () => {
    setOpen(false);
    setDialogOpen(false);
  };

  return (
    <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure want to change the status?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
                statusData &&
                <Box>
                    Previous Status: <StatusStyle status={statusData.prevStatus} /> to New Status: <StatusStyle status={statusData.newStatus} />
                </Box>

            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={() => {setOpen(false); setUserAgreed(false);  setDialogOpen(false);}}>
                No
            </Button>
            <Button   
                onClick={() => {
                    setOpen(false); 
                    setUserAgreed(true);  
                    setDialogOpen(false);
                }} 
                autoFocus
                sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    width:'20%',
                    py: 1,
                    background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
                    color: '#fff',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 8px 25px rgba(255, 107, 53, 0.4)',
                    },
                }}
            >
            Yes
            </Button>
        </DialogActions>
    </Dialog>
  );
}

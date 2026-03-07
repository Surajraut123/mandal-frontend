import { toast } from "react-hot-toast";
import { Box, Button, Typography } from "@mui/material";

export const showTokenExpiredToast = (props) => {
  toast(
    (t) => (
      <Box sx={{ minWidth: 260 }}>
        <Typography variant="subtitle1" fontWeight={600}>
           {props?.message}
        </Typography>

        <Typography variant="body2" sx={{ mt: 0.5, mb: 1.5 }}>
          Please login again to continue.
        </Typography>

        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={() => {
            toast.dismiss(t.id);
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Go to Login
        </Button>
      </Box>
    ),
    {
      duration: Infinity,
      style: {
        padding: "16px"
      },
      position: "top-center"
    }
  );
};

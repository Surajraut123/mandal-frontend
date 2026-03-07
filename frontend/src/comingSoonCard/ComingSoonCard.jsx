import { Schedule } from "@mui/icons-material";
import { Card, CardContent, Chip, Slide, Typography, useTheme } from "@mui/material";

const ComingSoonCard = ({ year, name }) => {
  const theme = useTheme();
  
  return (
    <Slide direction="up" in timeout={600}>
      <Card
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
          border: '2px dashed rgba(255, 107, 53, 0.3)',
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Schedule
            sx={{
              fontSize: 80,
              color: theme.palette.primary.main,
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          >
            {year} {name}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Data for {year} will be available soon.
            Stay tuned for updates!
          </Typography>
          <Chip
            label="Coming Soon"
            color="primary"
            variant="outlined"
            sx={{
              fontSize: '1rem',
              py: 2,
              px: 3,
              fontWeight: 600,
            }}
          />
        </CardContent>
      </Card>
    </Slide>
  );
};

export default ComingSoonCard
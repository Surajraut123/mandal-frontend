import React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Paper,
} from '@mui/material';
import {
  AccountCircle,
  People,
  Star,
  Call,
  Info,
  Security,
  TouchApp,
} from '@mui/icons-material';

// 1. Theme and Styled Components
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF9800', // Light orange
    },
    secondary: {
      main: '#607D8B',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '12px 30px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 15,
        },
      },
    },
  },
});

const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: 'fadeIn 1.5s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}));

// 2. Main App Component
const App = () => {
  const pages = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Statistics', id: 'stats' },
    { name: 'Designer', id: 'designer' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        {/* Header/Navbar */}
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Mandal Management
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  sx={{ mx: 1, color: 'text.primary' }}
                  onClick={() => handleScroll(page.id)}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        
        {/* Home Section */}
        <AnimatedBox id="home"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            backgroundImage: `linear-gradient(to left, rgba(245, 245, 245, 0), rgba(245, 245, 245, 1) 50%), url(https://wallpapers.com/images/hd/large-ganesh-statue-iphone-4v06v2njvsd396pf.jpg)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            position: 'relative',
            py: 8
          }}
        >
          <Container sx={{ zIndex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ maxWidth: { md: '50%' } }}>
              <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                Ganapati Mandal Money Management
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Empower your community with a streamlined and secure platform for managing funds, events, and community engagement.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button variant="contained" color="primary" onClick={() => handleScroll('about')}>
                  Learn More
                </Button>
                <Button variant="outlined" color="primary" onClick={() => handleScroll('about')}>
                  Try It Now
                </Button>
              </Box>
            </Box>
          </Container>
        </AnimatedBox>

        {/* About Section */}
        <AnimatedBox id="about" sx={{ my: 8 }}>
          <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
              About Our Platform
            </Typography>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {/* Centralized Management */}
              <Grid item xs={12} md={4}>
                <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                  <AccountCircle color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Centralized Management
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      Our platform provides a dedicated space for each community to manage their financial activities. From tracking donations to planning expenses, everything is at your fingertips.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Secure and Transparent */}
              <Grid item xs={12} md={4}>
                <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                  <Security color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Secure and Transparent
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      We ensure the highest level of security for your data and transactions. All financial activities are logged, providing complete transparency for every member of the community.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Easy to Use */}
              <Grid item xs={12} md={4}>
                <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                  <TouchApp color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Easy to Use
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      Designed with simplicity in mind, our user-friendly interface allows even non-technical users to set up and manage their community's account effortlessly.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </AnimatedBox>

        {/* Statistics Section */}
        <AnimatedBox id="stats" sx={{ my: 8 }}>
          <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
              Our Achievements
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ textAlign: 'center' }}>
              <Grid item xs={12} sm={4}>
                <Card raised sx={{ p: 4 }}>
                  <People color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h3" color="primary.main">50+</Typography>
                  <Typography variant="h6" color="text.secondary">Communities Used</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card raised sx={{ p: 4 }}>
                  <Star color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h3" color="primary.main">4.8</Typography>
                  <Typography variant="h6" color="text.secondary">Average Rating</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card raised sx={{ p: 4 }}>
                  <Info color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h3" color="primary.main">200+</Typography>
                  <Typography variant="h6" color="text.secondary">Positive Feedbacks</Typography>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </AnimatedBox>

        {/* Designer Section */}
        <AnimatedBox id="designer" sx={{ my: 8 }}>
          <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
              Platform Designer
            </Typography>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 15 }}>
              <AccountCircle color="primary" sx={{ fontSize: 100, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Abhishek
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                UI/UX Designer & Software Developer
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Passionate about creating elegant and functional digital experiences. This platform was designed to be user-centric, secure, and visually appealing.
              </Typography>
            </Paper>
          </Container>
        </AnimatedBox>

        {/* Contact Section */}
        <AnimatedBox id="contact" sx={{ my: 8 }}>
          <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
              Contact Us
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 15 }}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Have questions? Send us a message!
              </Typography>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                sx={{ borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                sx={{ borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                margin="normal"
                sx={{ borderRadius: 2 }}
              />
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                Submit
              </Button>
            </Paper>
          </Container>
        </AnimatedBox>

        {/* Footer */}
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 4, textAlign: 'center' }}>
          <Container>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Ganapati Mandal Management. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, InputAdornment, IconButton, Card, CardContent, Typography, Container, Fade, Slide, useTheme, Link, CircularProgress,} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Login as LoginIcon, CheckCircleOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import auth from './auth.json';
import { useDispatch } from 'react-redux';
import { setRole, setToken } from '../redux/slice/slice';
import { postCall } from '../axios/apis';
import {apiEndPointConstants} from '../axios/endpoint';
const Login = ({onLogin}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginData, setLoginData] = React.useState(auth.Login);
  const [loginStatus, setLoginStatus] = useState('');
  const [loader, setLoader] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword((show) => !show);
  };

  const handleLogin = async () => {
    setLoader(true)
    try {
      const body = {
        "email" : loginData?.username, 
        "password" : loginData?.password
      }
      const response = await postCall(apiEndPointConstants.LOGIN_ENDPOINT, body)
      console.log("Login Response : ", response)
      setLoginStatus(response?.data?.message)
      setLoader(false)
      setStatusVisible(true)
      dispatch(setRole(response?.data?.data?.role))
      onLogin(true)
      console.log("Logged in response : ", response)
    } catch (error) { 
      onLogin(false)
      console.log("Error while login : ", error)
      if (error.response) {
        if (error.response.status === 401) {
          console.log("Unauthorized, login failed");
          setLoginStatus({ message: "Unauthorized. Please check your credentials." });
        } else {
          setLoginStatus({ message: "Something went wrong! Please try again." });
        }
      } else if (error.request) {
        setLoginStatus({ message: "Network error. Please check your connection." });
      } else {
        setLoginStatus({ message: "Unexpected error occurred. Please try again." });
      }
      setStatusVisible(true)
      setLoader(false)
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if(loginStatus)
        setStatusVisible(false)
    }, 2000)
  }, [loginStatus])

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCC80 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FF6B35" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0px 20px 60px rgba(255, 107, 53, 0.2)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 107, 53, 0.1)',
              overflow: 'visible',
              position: 'relative',
              '&::before': {
                content: '"🕉️"',
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '2rem',
                background: 'linear-gradient(45deg, #FF6B35, #FFC107)',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 8px 24px rgba(255, 107, 53, 0.3)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 5, sm: 6 } }}>
              <Slide direction="down" in timeout={1000}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #FF6B35, #D32F2F)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Welcome Back!
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Sign in to your Ganapati Mandal account
                  </Typography>
                </Box>
              </Slide>

              <Slide direction="up" in timeout={1200}>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Username/Email"
                    variant="outlined"
                    type="email"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    sx={{ mb: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword}
                            edge="end"
                            sx={{
                              transition: 'transform 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {loginStatus!=='' && statusVisible && 
                    <Box
                      sx={{
                            display: 'flex',
                            border: `1px solid ${loginStatus?.status ? '#90ff81' : '#ffdddd'}`,
                            borderRadius: "10px",
                            padding: "10px",
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: loginStatus?.status ? 'green' : 'red'
                      }}
                    >
                      <CheckCircleOutlineOutlined sx={{ mr: 1 }} />
                      <Typography>{loginStatus?.message}</Typography>
                    </Box>
                  }

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    startIcon={!loader && <LoginIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 3,
                      mt: 1,
                      background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 8px 25px rgba(255, 107, 53, 0.4)',
                      },
                    }}
                  >
                    {!loader ? 'Sign In' : <CircularProgress color='white'/>}
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't remember your password?{' '}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleResetPassword}
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            color: theme.palette.primary.dark,
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Reset Password
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Slide>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
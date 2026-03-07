import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, InputAdornment, IconButton, Card, CardContent, Typography, Container, Fade, Slide, useTheme, Link, Grid, CircularProgress, styled, Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Lock, Phone, Cake, PersonAdd, CheckCircleOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import auth from './auth.json'
import { apiEndPointConstants } from '../axios/endpoint';
import { postCall } from '../axios/apis';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [registerData, setRegisterData] = React.useState(auth.Register);
  const [registerStatus, setRegisterStatus] = useState('')
  const [loader, setLoader] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Enter valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const theme = useTheme();
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((show) => !show);
  };


  const handleChange = (event) => {
    setRegisterData({...registerData, role: event.target.value});
  };

  const handleRegister = async () => {

    try {
      setLoader(true)
      const body = {
        firstName : registerData?.firstName,
        lastName : registerData?.lastName,
        email : registerData?.emailId,
        password : registerData?.password,
        profileImage : registerData?.profileImage,
        contact : registerData?.contact,
        role: registerData?.role
      }
      const header = {
        'Content-Type': 'application/json',
        Authorization : `Bearer ${localStorage.getItem('token')}`
      }
      const response = await postCall(apiEndPointConstants.REGISTER_ENDPOINT, body, header)
      console.log("REgister : ", response) 
      setRegisterStatus(response?.data)
      setLoader(false)
      setStatusVisible(true)
      setRegisterData({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        profileImage : "",
        contact : "",
        role: ""
      })
      
    } catch (error) {
      setLoader(false)
      setRegisterStatus(error?.response?.data)
      setStatusVisible(true)
      console.log("Error while register : ", error)
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    setTimeout(() => {
      setStatusVisible(false)
    }, 3000)
  }, [statusVisible])

  const Input = styled('input')({
    '::file-selector-button': {
      background: '#d5d5d5',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer'
    }
  });

  const handleUpload = (event) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      // registerData?.profile = {
      //   file: base64String,
      //   name: file.name
      // }
    };
    reader.readAsDataURL(file);
  }

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
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
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
                content: '"🎉"',
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
                    Add member to Mandal!
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Create member account to start contributing
                  </Typography>
                </Box>
              </Slide>

              <Slide direction="up" in timeout={1200}>
                <Box component="form" 
                  sx={{ 
                    mt: 2, 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                  }} data-id="form-box">
                  <Grid container spacing={3} data-id="form-grid">
                    <Box data-id="field-box"
                      sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            width: '100%'
                      }}  
                    >
                      <Grid item xs={12} sm={6} data-id="field" sx={{width: '40%'}}>
                        <TextField
                          fullWidth
                          label="First Name"
                          variant="outlined"
                          data-id="text-field"
                          required
                          value={registerData?.firstName}
                          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                          sx={{
                            width: '100%'
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} data-id="field" sx={{width: '40%'}}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          variant="outlined"
                          data-id="text-field"
                          required
                          value={registerData?.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          sx={{
                            width: '100%'
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Box>

                    <Box data-id="field-box"
                      sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            width: '100%'
                      }}  
                    >
                      <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                        <TextField
                          fullWidth
                          label="Email"
                          variant="outlined"
                          type="email"
                          required
                          value={registerData?.emailId}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, emailId: e.target.value });
                            if (e.target.value && emailError) validateEmail(e.target.value);
                          }}
                          onBlur={(e) => validateEmail(e.target.value)}
                          error={!!emailError}
                          helperText={emailError}
                          sx={{
                            width: '100%'
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                        <TextField
                          fullWidth
                          label="Password"
                          variant="outlined"
                          required
                          type={showPassword ? 'text' : 'password'}
                          value={registerData?.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          sx={{
                            width: '100%'
                          }}
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
                      </Grid>
                    </Box>
                    
                    <Box data-id="field-box"
                      sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            width: '100%'
                      }}  
                    >
                      <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        required
                        value={registerData?.contact}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setRegisterData({ ...registerData, contact: value });
                          if (value.length === 10) validatePhone(value);
                        }}
                        onBlur={(e) => validatePhone(e.target.value)}
                        error={!!phoneError}
                        helperText={phoneError}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                      {/* <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                        <Input type='file' id='upload-file' handleUploadChange={handleUpload}/>
                      </Grid> */}
                      <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Role</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={registerData?.role}
                            label="Role"
                            onChange={handleChange}
                            fullWidth
                          >
                            <MenuItem value="treasurer">Treasurer</MenuItem>
                            <MenuItem value="member">Member</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Box>
                  </Grid>
                   {registerStatus!=='' && statusVisible && 
                      <Box
                        sx={{
                              display: 'flex',
                              border: `1px solid ${registerStatus?.status === "SUCCESS" ? '#90ff81' : '#ffdddd'}`,
                              borderRadius: "10px",
                              padding: "10px",
                              justifyContent: 'center',
                              alignItems: 'center',
                              mt:2,
                              color: registerStatus?.status === "SUCCESS" ? 'green' : 'red'
                        }}
                      >
                        <CheckCircleOutlineOutlined sx={{ mr: 1 }} />
                        <Typography>{registerStatus?.message}</Typography>
                      </Box>
                    }
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={!loader && <PersonAdd />}
                    onClick={()=> handleRegister()}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mt: 3,
                      mb: 3,
                      background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 8px 25px rgba(255, 107, 53, 0.4)',
                      },
                    }}
                  >
                    {!loader ? 'Create Account' : <CircularProgress color='white'/>}
                  </Button>

                  
                </Box>
              </Slide>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  InputAdornment, 
  Card, 
  CardContent, 
  Typography, 
  Container, 
  Fade, 
  Slide, 
  useTheme,
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  Email, 
  CheckCircleOutlineOutlined, 
  ArrowBack,
  VpnKey,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { postCall } from '../axios/apis';
import { apiEndPointConstants } from '../axios/endpoint';

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [statusVisible, setStatusVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const theme = useTheme();
  const navigate = useNavigate();

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

  const validatePassword = () => {
    if (!newPassword) {
      setPasswordError('Password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateEmail(email)) return;
    
    setLoader(true);
    try {
      const body = { email };
      const response = await postCall(apiEndPointConstants.VERIFY_EMAIL_ENDPOINT, body);
      
      setMessage(response?.data?.message || 'OTP sent to your email');
      setStatusVisible(true);
      setStep(2);
      setLoader(false);
    } catch (error) {
      console.log("Error sending OTP:", error);
      setMessage(error?.response?.data?.message || 'Failed to send OTP. Please try again.');
      setStatusVisible(true);
      setLoader(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setMessage('Please enter a valid 6-digit OTP');
      setStatusVisible(true);
      return;
    }

    setLoader(true);
    try {
      const body = { email, otp };
      const response = await postCall(apiEndPointConstants.VERIFY_OTP_ENDPOINT, body);
      
      setMessage(response?.data?.message || 'OTP verified successfully');
      setStatusVisible(true);
      setStep(3);
      setLoader(false);
    } catch (error) {
      console.log("Error verifying OTP:", error);
      setMessage(error?.response?.data?.message || 'Invalid OTP. Please try again.');
      setStatusVisible(true);
      setLoader(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      setStatusVisible(true);
      return;
    }

    setLoader(true);
    try {
      const body = { email, otp, newPassword };
      const response = await postCall(apiEndPointConstants.RESET_PASSWORD_ENDPOINT, body);
      
      setMessage(response?.data?.message || 'Password reset successful');
      setStatusVisible(true);
      setStep(4);
      setLoader(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.log("Error resetting password:", error);
      setMessage(error?.response?.data?.message || 'Failed to reset password. Please try again.');
      setStatusVisible(true);
      setLoader(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (message) setStatusVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Slide direction="up" in timeout={1200}>
            <Box>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                error={!!emailError}
                helperText={emailError}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSendOTP}
                disabled={loader || !email}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 8px 25px rgba(255, 107, 53, 0.4)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  },
                }}
              >
                {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send OTP'}
              </Button>
            </Box>
          </Slide>
        );

      case 2:
        return (
          <Slide direction="up" in timeout={1200}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Enter OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value);
                }}
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <IconButton
                  onClick={() => setStep(1)}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    },
                  }}
                >
                  <ArrowBack />
                </IconButton>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleVerifyOTP}
                  disabled={loader || otp.length < 6}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 8px 25px rgba(255, 107, 53, 0.4)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    },
                  }}
                >
                  {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Verify OTP'}
                </Button>
              </Box>

              <Button
                fullWidth
                variant="text"
                onClick={handleResendOTP}
                disabled={loader}
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                Resend OTP
              </Button>
            </Box>
          </Slide>
        );

      case 3:
        return (
          <Slide direction="up" in timeout={1200}>
            <Box>
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                error={!!passwordError}
                helperText={passwordError}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton
                  onClick={() => setStep(2)}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    },
                  }}
                >
                  <ArrowBack />
                </IconButton>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleResetPassword}
                  disabled={loader || !newPassword || !confirmPassword}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 8px 25px rgba(255, 107, 53, 0.4)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    },
                  }}
                >
                  {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
                </Button>
              </Box>
            </Box>
          </Slide>
        );

      case 4:
        return (
          <Slide direction="up" in timeout={1200}>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleOutlineOutlined 
                sx={{ 
                  fontSize: 80, 
                  color: 'green',
                  mb: 2 
                }} 
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Password Reset Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your password has been changed successfully.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Redirecting to login...
              </Typography>
            </Box>
          </Slide>
        );

      default:
        return null;
    }
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
                content: '"🔑"',
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
              {step === 1 && (
                <IconButton
                  onClick={() => navigate('/login')}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    },
                  }}
                >
                  <ArrowBack />
                </IconButton>
              )}

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
                    {step === 4 ? 'All Done!' : 'Reset Password'}
                  </Typography>
                  {step < 4 && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {step === 1 && 'Enter your email to receive OTP'}
                      {step === 2 && 'Enter the OTP sent to your email'}
                      {step === 3 && 'Create your new password'}
                    </Typography>
                  )}
                </Box>
              </Slide>

              {message && statusVisible && (
                <Box
                  sx={{
                    display: 'flex',
                    border: `1px solid ${message.toLowerCase().includes('success') || message.toLowerCase().includes('sent') || message.toLowerCase().includes('verified') ? '#90ff81' : '#ffdddd'}`,
                    borderRadius: "10px",
                    padding: "10px",
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: message.toLowerCase().includes('success') || message.toLowerCase().includes('sent') || message.toLowerCase().includes('verified') ? 'green' : 'red',
                    mb: 2,
                  }}
                >
                  <CheckCircleOutlineOutlined sx={{ mr: 1 }} />
                  <Typography>{message}</Typography>
                </Box>
              )}

              {renderStepContent()}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default ResetPassword;
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
  Grid, 
  CircularProgress,
  Avatar,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  CheckCircleOutlineOutlined,
  ArrowBack,
  PhotoCamera,
  Save,
  Close,
  WbSunny,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { postCall, getCall, patchCall } from './axios/apis';
import { apiEndPointConstants } from './axios/endpoint';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: '',
    status: '',
    role: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(true);
  const [message, setMessage] = useState('');
  const [statusVisible, setStatusVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setFetchLoader(true);
    try {
      const response = await getCall(apiEndPointConstants.GET_PROFILE_ENDPOINT);
      const data = response?.data?.data;
      console.log("Fetched profile data:", data);
      setProfileData({
        firstName: data?.firstname || '',
        lastName: data?.lastname || '',
        email: data?.email || '',
        phone: data?.phone_no || '',
        profileImage: data?.profile 
          ? `${VITE_BACKEND_URL}/${data.profile}`
          : '',
        status: data?.status ? "Active" : "Inactive",
        role: data?.roles?.role_name
          ? data.roles.role_name.charAt(0).toUpperCase() + data.roles.role_name.slice(1)
          : ''
      });
      setOriginalData({
        firstName: data?.firstname || '',
        lastName: data?.lastname || '',
        email: data?.email || '',
        phone: data?.phone_no || '',
        profileImage: data?.profile || '',
        status: data?.status ? "Active" : "Inactive",
        role: data?.roles?.role_name.charAt(0).toUpperCase() + data?.roles?.role_name.slice(1) || ''
      });
      setImagePreview(data?.profile || null);
      setFetchLoader(false);
    } catch (error) {
      console.log("Error fetching profile:", error);
      setFetchLoader(false);
    }
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file');
        setStatusVisible(true);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size should be less than 5MB');
        setStatusVisible(true);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateEmail(profileData.email) || !validatePhone(profileData.phone)) {
      return;
    }

    setLoader(true);
    try {
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = await patchCall(
        apiEndPointConstants.UPDATE_PROFILE_ENDPOINT, 
        {},
        formData
      );
      
      setMessage(response?.data?.message || 'Profile updated successfully');
      setStatusVisible(true);
      setLoader(false);
      
      // Refresh profile data
      setTimeout(() => {
        fetchProfileData();
      }, 1500);
    } catch (error) {
      console.log("Error updating profile:", error);
      setMessage(error?.response?.data?.message || 'Failed to update profile');
      setStatusVisible(true);
      setLoader(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (message) setStatusVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (fetchLoader) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCC80 100%)',
        }}
      >
        <CircularProgress sx={{ color: theme.palette.primary.main }} size={60} />
      </Box>
    );
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
                content: '"👤"',
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
              <IconButton
                onClick={handleCancel}
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
                    My Profile
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Manage your account information
                  </Typography>
                </Box>
              </Slide>

              <Slide direction="up" in timeout={1200}>
                <Box>
                    {/* Profile Image Upload */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={profileData.profileImage || imagePreview}
                            sx={{
                            width: 120,
                            height: 120,
                            border: `4px solid ${theme.palette.primary.main}`,
                            boxShadow: '0px 4px 20px rgba(255, 107, 53, 0.3)',
                            }}
                        >
                            <Person sx={{ fontSize: 60 }} />
                        </Avatar>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-image-upload"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="profile-image-upload">
                            <IconButton
                            component="span"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: 'linear-gradient(45deg, #FF6B35, #FF8A65)',
                                color: 'white',
                                '&:hover': {
                                background: 'linear-gradient(45deg, #E64A19, #FF6B35)',
                                },
                            }}
                            >
                            <PhotoCamera />
                            </IconButton>
                        </label>
                        </Box>
                    </Box>

                  <Grid container spacing={3}>
                    {/* First Name & Last Name */}
                    <Box sx={{ width: '100%', mb: 2, display: 'flex', gap: 2, justifyContent: 'space-evenly' }}>
                        <Grid item xs={12} sm={6} >
                        <TextField
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            required
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <Person sx={{ color: theme.palette.primary.main }} />
                                </InputAdornment>
                            ),
                            }}
                        />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            required
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
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

                    <Box sx={{ width: '100%', mb: 2, display: 'flex', gap: 2, justifyContent: 'space-evenly' }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                type="email"
                                required
                                value={profileData.email}
                                onChange={(e) => {
                                setProfileData({ ...profileData, email: e.target.value });
                                if (emailError) validateEmail(e.target.value);
                                }}
                                onBlur={() => validateEmail(profileData.email)}
                                error={!!emailError}
                                helperText={emailError}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <Email sx={{ color: theme.palette.primary.main }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Phone Number */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                variant="outlined"
                                required
                                value={profileData.phone}
                                onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setProfileData({ ...profileData, phone: value });
                                if (value.length === 10) validatePhone(value);
                                }}
                                onBlur={() => validatePhone(profileData.phone)}
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
                    </Box>

                    <Box sx={{ width: '100%', mb: 2, display: 'flex', gap: 2, justifyContent: 'space-evenly' }}>
                    {/* Status (Non-editable) */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Status"
                                variant="outlined"
                                value={profileData.status}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WbSunny sx={{ color: theme.palette.primary.main }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: 'transparent',
                                    },
                                }}
                            />
                        </Grid>

                        {/* Role (Non-editable) */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Role"
                                variant="outlined"
                                value={profileData.role}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AdminPanelSettings sx={{ color: theme.palette.primary.main }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: 'transparent',
                                    },
                                }}
                            />
                        </Grid>
                    </Box>
                  </Grid>

                  {/* Status Message */}
                  {message && statusVisible && (
                    <Box
                      sx={{
                        display: 'flex',
                        border: `1px solid ${message.toLowerCase().includes('success') ? '#90ff81' : '#ffdddd'}`,
                        borderRadius: "10px",
                        padding: "10px",
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 3,
                        color: message.toLowerCase().includes('success') ? 'green' : 'red',
                      }}
                    >
                      <CheckCircleOutlineOutlined sx={{ mr: 1 }} />
                      <Typography>{message}</Typography>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Close />}
                      onClick={handleCancel}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: 'rgba(255, 107, 53, 0.05)',
                        },
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={!loader && <Save />}
                      onClick={handleSave}
                      disabled={loader}
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
                      {loader ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                    </Button>
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

export default Profile;
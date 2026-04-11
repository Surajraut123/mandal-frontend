import { AddCard, CheckCircleOutlineOutlined, CurrencyRupeeSharp, Email, Person, PersonAdd, Phone, Receipt } from '@mui/icons-material';
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, Grid, InputAdornment, Slide, Switch, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import {postCall} from '../axios/apis';
import { apiEndPointConstants } from '../axios/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import Invoice from '../invoice/Invoice';
import { pdf } from '@react-pdf/renderer';
import { updateRequestStatus } from '../redux/slice/slice';

const Contribution = () => {

    const [mandalUsers, setMandalUsers] = useState([])
    const [loader, setLoader] = useState(false)
    const [options, setOptions] = useState([]);
    const [contributionDetails, setContributionDetails] = useState({
        donor_name: "",
        phone_no: null,
        amount: 0
    })
    const [statusMessage, setStatusMessage] = useState();
    const [statusVisible, setStatusVisible] = useState(false);
    const [receiptWant, setReceiptWant] = useState(false);
    const mandalMembers = useSelector((state) => state.role.userContributedData)   
    const loggedInUserId = useSelector((state) => state.role.userId)   
    const dispatch = useDispatch(); 

    const [phoneError, setPhoneError] = useState('');

    const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) {
        setPhoneError('');
        return true;
    }
    if (!phoneRegex.test(phone)) {
        setPhoneError('Enter valid 10-digit phone number');
        return false;
    }
    setPhoneError('');
    return true;
    };

    useEffect(() => {
        console.log("trigger")
        const fetchUsers = async () => {
            try {
            const filteredData = mandalMembers?.message?.map((data) => ({
                donor_name: data?.donor_name,
                phone_no: data?.phone_no
            }));
            setMandalUsers(filteredData);
            } catch (error) {
              console.log("Error while fetching users : ", error?.message);
            }
        };
        if(mandalUsers.length == 0) {
            fetchUsers();
        }
    }, [])

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob); // returns base64 string
        });
      };

    const generatePDFBlob = async () => {
        const blob = await pdf(<Invoice />).toBlob();
        return blob;
    };

    const handleGeneratePDF = async () => {
        const pdfBlob = await generatePDFBlob();
        return pdfBlob
    };

    const sendPDF = async () => {
        try {
            const blob = await handleGeneratePDF();
            const base64PDF = await blobToBase64(blob);
            const response = await postCall(apiEndPointConstants.SEND_INVOICE_PDF, {blobMemory: base64PDF})
            console.log("PDF Sent Successfully : ", response)
        } catch (error) {
            console.log("Error while sending pdf : ", error.message)
        }
    } 

    const addContribution = async () => {
        // sendPDF();
        try {
            setLoader(true)
            if(contributionDetails && contributionDetails?.amount > 0) {
                const body = {
                    "amount" : contributionDetails?.amount,
                    "userId": loggedInUserId,
                    "donorName": contributionDetails?.donor_name,
                    "phone_no": contributionDetails?.phone_no
                }
                console.log("Body to be sent : ", body)
                const response = await postCall(apiEndPointConstants.REQUEST_CONTRIBUTION_ENDPOINT, body)
                dispatch(updateRequestStatus({ data: response?.data?.data, type: "contribution", event : "add" }));
                console.log("Add Contribution Response : ", response)
                setContributionDetails({
                    donor_name: "",
                    phone_no: "",
                    amount: 0
                })
                setLoader(false)
                setStatusMessage(response?.data)
                setStatusVisible(true)
            } else{
                setStatusVisible(true)
                setStatusMessage({status: false, message: "Please fill required data"})
                setLoader(false)
            }
        } catch (error) {
            setLoader(false)
            console.log("While adding contribution : ", error)
            setStatusMessage({status: false, message: "Something went wrong. Please try again."})
            setStatusVisible(true)
        }
    }

    const ANONYMOUS_OPTION = {
        donor_name: "Anonymous",
        phone_no: null
    };   
    const handleInputChange = (event, newInputValue) => {
        setContributionDetails((prev) => {
            return {
                ...prev,
                donor_name: newInputValue
            }
        });
        if (newInputValue.trim() === "") {
            setOptions([]);
        } else {
            let filtered = [];
            for(let i=0; i<mandalUsers?.length; i++) {
                if(mandalUsers[i]?.donor_name.toLowerCase().includes(newInputValue?.toLowerCase())){
                    console.log("Matched User : ", mandalUsers[i])
                    filtered.push(mandalUsers[i])
                } else{
                    filtered = [ANONYMOUS_OPTION];
                }
            }
            setOptions(filtered);
        }
    }

    const handleReceipt = () => {
        setReceiptWant((prev) => !prev)
    }

    useEffect(() => {
        setTimeout(() => {
            setStatusVisible(false)
        }, 3000)
    }, [statusVisible])

    const theme = useTheme();
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', pt: { xs: 5, sm: 6 }, pb: 2, px: { xs: 1, sm: 2 } }}>
        <Card
            sx={{
                width: '100%',
                maxWidth: 900,
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
                    <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }} data-id="header-box">
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
                            Add Contribution
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                            >
                            Start contributing amount of your members
                        </Typography>
                    </Box>
                </Slide>

                <Slide direction="up" in timeout={1200}>
                    <Box 
                        component="form" 
                        sx={{ 
                            mt: 2, 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%'
                        }} 
                        data-id="form-box"
                    >  
                        <Grid 
                            container 
                            spacing={3} 
                            data-id="form-grid" 
                            sx={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                flexDirection:'column', 
                                alignItems:'center',
                                width: '80%',
                            }}
                        >
                            <Box 
                                data-id="field-box"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                    width: '100%'
                                }}  
                            >
                                <Grid item xs={12} sm={6} data-id="field" sx={{width: '40%'}}>
                                    <Autocomplete
                                        freeSolo
                                        options={options}
                                        value={null}
                                        inputValue={contributionDetails?.donor_name}
                                        getOptionLabel={(option) =>
                                            option = option?.donor_name || ""
                                        }
                                        onInputChange={handleInputChange}
                                        onChange={(event, newValue) => {
                                            console.log("Selected Value : ", newValue)
                                            setContributionDetails((prev) => {
                                                return {
                                                    ...prev,
                                                    donor_name: newValue ? newValue.donor_name : ""
                                                }
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Add Contributor name"
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person sx={{ color: theme.palette.primary.main }} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
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
                                        label="Contribution Amount"
                                        variant="outlined"
                                        required
                                        value={contributionDetails.amount}
                                        onChange={(event) => setContributionDetails(prev => {
                                            return {
                                                ...prev,
                                                amount: event.target.value
                                            }
                                        })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupeeSharp sx={{ color: theme.palette.primary.main }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Box>

                            <Box data-id="field-box"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems:'center',
                                    gap: 2,
                                    width: '100%'
                                }}  
                            >
                                <Typography>Reciept want?</Typography>
                                <Switch 
                                    checked={receiptWant}
                                    onChange={handleReceipt}
                                />
                            </Box>

                            
                            {receiptWant && 
                                <>
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
                                            label="Phone No"
                                            variant="outlined"
                                            value={contributionDetails.phone_no}
                                            placeholder='0000-0000-000'
                                            onChange={(event) => {
                                            const value = event.target.value.replace(/\D/g, '');
                                            setContributionDetails(prev => ({
                                                ...prev,
                                                phone_no: value
                                            }));
                                            if (value.length === 10) validatePhone(value);
                                            }}
                                            onBlur={(event) => validatePhone(event.target.value)}
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
                                {/* <Box data-id="field-box"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-evenly',
                                        width: '100%'
                                    }}  
                                >
                                    <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                                        <TextField
                                            fullWidth
                                            label="Receipt No"
                                            variant="outlined"
                                            required
                                            value={amount}
                                            onChange={(event) => setAmount(event.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Receipt sx={{ color: theme.palette.primary.main }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Box> */}
                                </>
                            }

                            {statusVisible &&
                                <Box
                                    sx={{
                                            display: 'flex',
                                            border: `1px solid ${statusMessage?.status === "SUCCESS" ? '#90ff81' : '#ffdddd'}`,
                                            borderRadius: "10px",
                                            padding: "10px",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt:2,
                                            color: statusMessage?.status === "SUCCESS" ? 'green' : 'red'
                                    }}
                                    >
                                    <CheckCircleOutlineOutlined sx={{ mr: 1 }} />
                                    <Typography>{statusMessage?.message}</Typography>
                                </Box>
                            }
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={!loader && <AddCard />}
                                onClick={()=> addContribution()}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    width:'50%',
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
                                {!loader ? 'Add Contribution' : <CircularProgress color='white'/>}
                            </Button>
                        </Grid>
                    </Box>
                </Slide>
            </CardContent>
        </Card>
        </Box>
    )
}

export default Contribution
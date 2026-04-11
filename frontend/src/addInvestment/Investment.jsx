import { AddCard, CheckCircleOutlineOutlined, CurrencyRupee, CurrencyRupeeOutlined, Description, Email, Person, Phone, ShoppingCart, Title } from '@mui/icons-material';
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, Grid, InputAdornment, Slide, Switch, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { postCall } from '../axios/apis';
import {apiEndPointConstants} from '../axios/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { updateRequestStatus } from '../redux/slice/slice';

const Investment = () => {

    const [checked, setChecked] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [mandalUsers, setMandalUsers] = useState()
    const [user, setUser] = useState('')
    const [statusMessage, setStatusMessage] = useState();
    const [statusVisible, setStatusVisible] = useState(false);
    const [inputdata, setInputData] = useState({
        "title" : "",
        "description" : "",
        "amount": "",
        "shopName" : "",
        "userId": Number(localStorage.getItem('userid'))
    });
    const mandalMembers = useSelector((state) => state.role.mandalMembers)
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false)
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

     useEffect(() => {
        async function getUsers() {
            try {
                const filteredData = mandalMembers?.userList.map((data) => {
                    return {
                        "fullName" : data?.fullName,
                        "status" : data?.status,
                        "roleId" : data?.role,
                        "updated_by" : data?.userId
                    }
                })
                setMandalUsers(filteredData)
            } catch (error) {
                console.log("Error while fetching users : ", error?.message)
            }
        }
        checked && getUsers()
    }, [checked])

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        if (newInputValue.trim() === "") {
            setOptions([]);
        } else {
            let filtered = [];
            for(let i=0; i<mandalUsers.length; i++) {
                if(mandalUsers[i]?.status == 'active' && mandalUsers[i]?.fullName.toLowerCase().includes(newInputValue?.toLowerCase())){
                    filtered.push(mandalUsers[i])
                }
            }
            setOptions(filtered);
        }
    }

    const addInvestment = async () => {
        try {
            setLoader(true)
            setInputData({
                ...inputdata
            })
            // selfUserId : user ? {"userId": user.userId, "status": "pending"} : {} will do later
            console.log("Input Data : ", inputdata)
            const response = await postCall(apiEndPointConstants.REQUEST_INVESTMENT_ENDPOINT, inputdata)
            dispatch(updateRequestStatus({ data: response?.data?.data, type: "investment", event : "add" }));
            console.log("Response after adding investment : ", response?.data)
            setStatusMessage(response?.data)
            setStatusVisible(true)
            setLoader(false)
            setInputData({title : "",description : "", amount: "", shopName : "", treasureUserId: "", selfUserId : {} })
            
        } catch (error) {
            setLoader(false)
            setStatusMessage(error?.response?.data)
            setStatusVisible(true)
            console.log("Error while adding investment : ", error?.response?.data)
        }
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
                            Add Investment
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                            >
                            Start updating investment amount for your mandal.
                        </Typography>
                    </Box>
                </Slide>

                <Slide direction="up" in timeout={1200}>
                    <Box component="form" 
                        sx={{ 
                            mt: 2, 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 3
                            }} data-id="form-box">
                        <Grid item xs={12} sm={6} data-id="field" sx={{width: '40%'}}>
                            <TextField
                                fullWidth
                                label="Title"
                                variant="outlined"
                                data-id="text-field"
                                required
                                value={inputdata?.title}
                                onChange={(event) => setInputData({...inputdata, title: event.target.value})}
                                sx={{
                                width: '100%'
                                }}
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Title sx={{ color: theme.palette.primary.main }} />
                                    </InputAdornment>
                                ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} data-id="field" sx={{width: '40%'}}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                data-id="text-field"
                                value={inputdata?.description}
                                onChange={(event) => setInputData({...inputdata, description: event.target.value})}
                                sx={{
                                width: '100%'
                                }}
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Description sx={{ color: theme.palette.primary.main }} />
                                    </InputAdornment>
                                ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                            <TextField
                                fullWidth
                                label="Amount"
                                variant="outlined"
                                type="email"
                                required
                                value={inputdata.amount}
                                onChange={(event) => setInputData({...inputdata, amount: event.target.value})}
                                sx={{
                                    width: '100%'
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CurrencyRupee sx={{ color: theme.palette.primary.main }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                            <TextField
                                fullWidth
                                label="Shop Name"
                                variant="outlined"
                                required
                                type="text"
                                value={inputdata?.shopName}
                                onChange={(event) => setInputData({...inputdata, shopName: event.target.value})}
                                sx={{
                                    width: '100%'
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ShoppingCart sx={{ color: theme.palette.primary.main }} />
                                        </InputAdornment>
                                    ),
                                }}
                                
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{width: '40%'}}>
                            <Typography>Is this a Member's Investment?</Typography>
                            <Switch
                                checked={checked}
                                onChange={handleChange}
                                slotProps={{ input: { 'aria-label': 'controlled' } }}
                            />
                        </Grid>

                        {checked && <Box data-id="field-box"
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
                                    getOptionLabel={(option) => option.fullName || ""}
                                    inputValue={inputValue}
                                    onInputChange={handleInputChange}
                                    onChange={(event, newValue) => {
                                        setUser(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Search User" variant='outlined'/>
                                    )}
                                />
                            </Grid>
                        </Box>}

                        {statusVisible &&
                            <Box
                                sx={{
                                        display: 'flex',
                                        border: `1px solid ${statusMessage?.status=="SUCCESS" ? '#90ff81' : '#ffdddd'}`,
                                        borderRadius: "10px",
                                        padding: "10px",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mt:2,
                                        color: statusMessage?.status=="SUCCESS" ? 'green' : 'red'
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
                            onClick={addInvestment}
                            sx={{
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                mt: 3,
                                mb: 3,
                                width: '40%',
                                background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0px 8px 25px rgba(255, 107, 53, 0.4)',
                                },
                            }}
                        >
                           {!loader ? 'Add Investment' : <CircularProgress color='white'/>}
                        </Button>
                    </Box>
                </Slide>
            </CardContent>
        </Card>
        </Box>
    )
}

export default Investment
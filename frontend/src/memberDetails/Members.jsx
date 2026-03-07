import { Avatar, Box, Chip, Fade, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GanapatiImg from '../assets/ganapati.jpg'
import CommonSelect from '../recentUpdates/Select'
import { ADMIN_ROLE_NAME } from '../constant/DefaultValues'
import ConfirmationDialog from '../recentUpdates/ConfirmationDialog'
import { apiEndPointConstants } from '../axios/endpoint'
import { patchCall } from '../axios/apis'
import toast from 'react-hot-toast'
import { updateMandalMemberStatus } from '../redux/slice/slice'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Members = () => {
    const mandalMembers = useSelector((state) => state.role.mandalMembers)
    const loggedInUserRoleName = useSelector((state) => state.role.roleName)
    const [statusData, setStatusData] = useState({});
    const [requestAgreed, setRequestAgreed] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [statusMap, setStatusMap] = useState([]);
    const [isUserAgreed, setUserAgreed] = useState(false);
    const dispatch = useDispatch();

    console.log("mandalMembers : ", mandalMembers)

    useEffect(() => {
        const newStatusMap = mandalMembers?.userList?.reduce((acc, item) => {
            acc[item.user_id] = item.status ? "active" : "inactive";
            return acc;
        }, {}) || {};
        setStatusMap(newStatusMap);
    }, []);

    const getRoleStyles = (roleName) => {
        switch (roleName) {
          case 'admin':
            return { backgroundColor: "#6a1b9a", color: "#fff", fontWeight: 600, minWidth: 80 };
          case 'treasurer':
            return { backgroundColor: "#00838f", color: "#fff", fontWeight: 600, minWidth: 80 };
          default:
            return { backgroundColor: "#546e7a", color: "#fff", fontWeight: 600, minWidth: 80 };
        }
      };
    
    const columns = [
        { id: 'profile', label: 'Profile', minWidth: 80, align: 'left' },
        { id: 'fullName', label: 'Full Name', minWidth: 180, align: 'left' },
        { id: 'phone_no', label: 'Phone', minWidth: 150, align: 'left' },
        { id: 'email', label: 'Email', minWidth: 150, align: 'left' },
        { id: 'role', label: 'Role', minWidth: 120, align: 'left' },
        { id: 'status', label: 'Status', minWidth: 120, align: 'left' }
    ];
    const theme = useTheme()

    function stringAvatar(name) {
        return {
            sx: {
            bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    function stringToColor(string) {
        let hash = 0;
        let i;
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    const handleStatusChange = (newStatus, user_id) => {
        setDialogOpen(true)
        setRequestAgreed(user_id);
        setStatusData({newStatus, user_id, prevStatus : statusMap[user_id] });
    };


    const updateStatus = async () => {
        try {
            const {newStatus, user_id} = statusData;
            if(!newStatus || !user_id) {
                return;
            }
            const endPoint = apiEndPointConstants.UPDATE_MEMBER_STATUS
            const endPointURL = `${endPoint}/${user_id}/${newStatus}`;
            const response = await toast.promise(
                patchCall(endPointURL),
                {
                  loading: "Updating status...",
                  success: "Member Status updated successfully!",
                  error: (err) => {
                    return (
                      err?.response?.data?.message ||
                      "Something went wrong. Please try again."
                    );
                  }
                }
              );
            console.log("Contribution Updated : ", response)
            if(response.status === 200) {
                console.log("Dispatching updateMandalMemberStatus with user_id : ", user_id, " newStatus : ", newStatus)
                dispatch(updateMandalMemberStatus({user_id, newStatus}));
                setStatusMap((prevStatusMap) => ({
                    ...prevStatusMap,
                    [user_id]: newStatus,
                }));
                setUserAgreed(0);
            }
        } catch (error) {
            console.error("Error updating contribution status: ", error);
            setUserAgreed(0);
        }
    }

    useEffect( () => {
        if(isUserAgreed) {
            updateStatus();
        }
    }, [isUserAgreed])
      
    return (
        <Box>
            <ConfirmationDialog dialogOpen={dialogOpen} setUserAgreed={setUserAgreed} setDialogOpen={setDialogOpen} statusData={statusData}/>
            <Slide direction="down" in timeout={800}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <img src={GanapatiImg} width="50px"/>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #FF6B35, #D32F2F)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                        }}
                    >
                        Community Members
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}
                        >
                        View all members who are part of our Ganapati Mandal
                    </Typography>
                </Box>
            </Slide>
            <Fade in timeout={1200}>
                <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: 1,
                    boxShadow: '0px 8px 32px rgba(255, 107, 53, 0.1)',
                }}
                >
                <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader aria-label="contributions table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mandalMembers?.userList?.map((row, index) => {
                            return (
                            <Fade in timeout={300 + index * 50} key={`${row.name}-${index}`}>
                                <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                sx={{
                                    transition: 'all 0.2s ease-in-out',
                                    cursor: 'pointer'
                                }}
                                >
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    const fullName = row['firstname'].concat(" ", row['lastname']);
                                    const roleName = row['roles'].role_name;
                                    const statusValue = value ? "active" : "inactive";
                                    const profile = row['profile'];
                                    return (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={{
                                        py: 2,
                                        borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
                                        fontSize: '0.95rem',
                                        }}
                                    >
                                        {column?.id === 'profile' ? (
                                            <Avatar
                                                src={`${VITE_BACKEND_URL}/${profile}`}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    background: 'linear-gradient(45deg, #FFC107 30%, #FFEB3B 90%)',
                                                    color: '#2E2E2E',
                                                    fontWeight: 600,
                                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                                }}
                                                {...stringAvatar(fullName)} 
                                            >
                                            </Avatar>
                                        ) : column.id === 'fullName' ? (
                                        <Typography
                                            variant="body1"
                                            sx={{
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                            }}
                                        >
                                            {fullName}
                                        </Typography>
                                        ) : column.id === 'status' ? (

                                            loggedInUserRoleName.toLowerCase() === ADMIN_ROLE_NAME ? (
                                                <CommonSelect
                                                    value={statusValue}
                                                    onChange={(e) => handleStatusChange(e.target.value, row['user_id'])}
                                                    isUserAgreed={requestAgreed === row['user_id'] ? isUserAgreed : false}
                                                    options={[
                                                        statusValue.toLowerCase() === "inactive" 
                                                            ? 
                                                        { value: 'active', label: 'Active' }
                                                            : 
                                                        { value: 'inactive', label: 'InActive' }
                                                    ]}
                                                />
                                            ) : (
                                                <Chip
                                                    label={roleName.charAt(0).toUpperCase() + roleName.slice(1)}
                                                    sx={getRoleStyles(roleName)}
                                                    size="small"
                                                />
                                            )
                                        ) : column?.id === 'role' ? (
                                            <Chip
                                                label={roleName.charAt(0).toUpperCase() + roleName.slice(1)}
                                                sx={getRoleStyles(roleName)}
                                                size="small"
                                            />
                                        ) : (
                                            value
                                        )}
                                    </TableCell>
                                    );
                                })}
                                </TableRow>
                            </Fade>
                            );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
            </Fade>
            {mandalMembers?.userList.length === 0 && <Typography sx={{display:'flex', justifyContent:'center', alignItems: 'center', width: '100%'}}>No members available</Typography>}
        </Box>
    )
}

export default Members

import { Avatar, Box, Chip, Fade, IconButton, InputAdornment, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import CommonSelect from './Select';
import dayjs from "dayjs";
import { patchCall } from '../axios/apis';
import { apiEndPointConstants } from '../axios/endpoint';
import ConfirmationDialog from './ConfirmationDialog';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN_ROLE_NAME, DEFAULT_RECENT_REQUEST_TYPE, TREASURER_ROLE_NAME } from '../constant/DefaultValues';
import { updateRequestStatus } from '../redux/slice/slice';
import StatusStyle from '../statusStyleDialog/StatusStyle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const RequestTables = (props) => {
    const { heading, desc, columns, data, type, roleName} = props;
    const dispatch = useDispatch(); 
    const TREASURER_ID = import.meta.env.VITE_TREASURER; 
    const ADMIN_ID = import.meta.env.VITE_ADMIN;
    const loggedInUserRoleName = useSelector((state) => state.role.roleName)
    console.log("Data in tables : ", loggedInUserRoleName)

    const [statusMap, setStatusMap] = useState([]);

    useEffect(() => {
        const newStatusMap = data?.data?.reduce((acc, item) => {
            acc[item.request_id] = item.request_status;
            return acc;
        }, {}) || {};
        setStatusMap(newStatusMap);
    }, [data]);
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUserAgreed, setUserAgreed] = useState(false);
    const [requestAgreed, setRequestAgreed] = useState(0);
    const [statusData, setStatusData] = useState({});

    const handleStatusChange = (newStatus, request_id) => {
        console.log("Status Change Triggered : ", newStatus, request_id)
        setDialogOpen(true)
        setRequestAgreed(request_id);
        setStatusData({newStatus, request_id, prevStatus : statusMap[request_id] });
    };

    const endPoint = useMemo(() => {
        return (type === DEFAULT_RECENT_REQUEST_TYPE) 
            ? apiEndPointConstants.UPDATE_CONTRIBUTION_REQUEST_STATUS
            : apiEndPointConstants.UPDATE_INVESTMENT_REQUEST_STATUS
    }, [type]) 
    const updateStatus = async (endPoint, type) => {
        try {
            const {newStatus, request_id} = statusData;
            if(!newStatus || !request_id) {
                return;
            }

            const endPointURL = `${endPoint}/${request_id}/${newStatus}`;
            const response = await toast.promise(
                patchCall(endPointURL),
                {
                  loading: "Updating status...",
                  success: "Status updated successfully!",
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
                dispatch(updateRequestStatus({ newStatus, request_id, type, event : "update" }));
                setStatusMap((prevStatusMap) => ({
                    ...prevStatusMap,
                    [request_id]: newStatus,
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
            updateStatus(endPoint, type);
        }
    }, [isUserAgreed])

    

    const getRoleStyles = (roleId) => {
        switch (roleId) {
          case '5':
            return { backgroundColor: "#6a1b9a", color: "#fff", fontWeight: 600, minWidth: 80 };
          case '4':
            return { backgroundColor: "#00838f", color: "#fff", fontWeight: 600, minWidth: 80 };
          default:
            return { backgroundColor: "#546e7a", color: "#fff", fontWeight: 600, minWidth: 80 };
        }
      };

    const getRoleName = (roleId) => {
        return roleId === TREASURER_ID ? "Treasurer" : roleId === ADMIN_ID ? "Admin" : "Member";
    }
    
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
      
    return (
        <Box>
            <ConfirmationDialog dialogOpen={dialogOpen} setUserAgreed={setUserAgreed} setDialogOpen={setDialogOpen} statusData={statusData}/>
            <Slide direction="down" in timeout={800}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    {/* <img src={GanapatiImg} width="50px"/> */}
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
                        {heading}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}
                        >
                        {desc}
                    </Typography>
                </Box>
            </Slide>
            <Fade in timeout={1200}>
                <Paper
                sx={{
                    width: '90%',
                    overflow: 'hidden',
                    borderRadius: 1,
                    boxShadow: '0px 8px 32px rgba(255, 107, 53, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    my: 4,
                }}
                >
                <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader aria-label="contributions table" sx={{ width: '100%', tableLayout: 'fixed' }}>
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
                            {data?.data?.map((row, index) => {

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
                                        const fullName = `${row?.users?.firstname || ''} ${row?.users?.lastname || ''}`.trim();
                                        const statusValue = statusMap[row.request_id] ? statusMap[row.request_id].toLowerCase() : row.request_status.toLowerCase();
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
                                                <Avatar {...stringAvatar(row['donor_name'])} />
                                            ) : column.id === 'fullName' ? (
                                            <Typography>
                                                {value}
                                            </Typography>
                                            ) : column.id === 'request_status' ? (
                                                roleName === TREASURER_ROLE_NAME ? 
                                                (<CommonSelect
                                                    value={statusValue}
                                                    onChange={(e) => handleStatusChange(e.target.value, row['request_id'])}
                                                    isUserAgreed={requestAgreed === row['request_id'] ? isUserAgreed : false}
                                                    options={[
                                                        { value: 'open', label: 'Open' },
                                                        { value: 'approved', label: 'Approved' },
                                                        { value: 'rejected', label: 'Rejected' },
                                                    ]}
                                                />) 
                                                : 
                                                <StatusStyle status={statusValue}/>
                                                
                                            ) : column?.id === 'role' ? (
                                                <Chip
                                                    label={getRoleName(value)}
                                                    sx={getRoleStyles(value)}
                                                    size="small"
                                                />
                                            ) : column?.id === 'added_by' ? (
                                                <Typography
                                                >
                                                    {fullName}
                                                </Typography>
                                            ) : column?.id === 'amount' ? (
                                                <Typography>
                                                    {`₹${value}`}
                                                </Typography>
                                            ) : column?.id === 'created_at' ? (
                                                <Typography>
                                                    {dayjs(value).format("MMM D, YYYY, h:mm A")}
                                                </Typography>
                                            ): column?.id === 'description' ? (
                                                <Typography>
                                                    {value.length > 30 ? `${value.substring(0, 20)}...` : value}
                                                </Typography>
                                            ) : column?.id === 'action' ? (
                                                (loggedInUserRoleName.toLowerCase() === ADMIN_ROLE_NAME) && 
                                                <TextField
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            border: "none",
                                                        },
                                                        "&:hover fieldset": {
                                                            border: "none",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            border: "none",
                                                        },
                                                        },
                                                    }}
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <IconButton>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
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
            {data?.data.length === 0 && <Typography sx={{display:'flex', justifyContent:'center', alignItems: 'center', width: '100%'}}>No request available</Typography>}
        </Box>
    )
}

export default RequestTables
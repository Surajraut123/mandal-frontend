import React, { useMemo } from 'react'
import RequestTables from './RequestTables'
import { AppBar, Box, Button, createTheme, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import details from './RequestDetails.json';
import { useSelector } from 'react-redux';
import { DEFAULT_RECENT_REQUEST_TYPE } from '../constant/DefaultValues';

const activeTabStyle = {
    backgroundColor: '#ffffffb8',
    color: '#eb3f00',
    fontweight: 'bold'
};
const RequestDashboard = () => {
    const [activeTab, setActiveTab] = React.useState(DEFAULT_RECENT_REQUEST_TYPE);

    const requestDetails = useSelector((state) => state.role.userContributedData);
    const investmentRequests = useSelector((state) => state.role.investMentRequestsData);
    const roleName = useSelector((state) => state.role.roleName)

    const recentRequestDetails = useMemo(() => {
        return activeTab === DEFAULT_RECENT_REQUEST_TYPE
          ? requestDetails
          : investmentRequests;
    }, [activeTab, requestDetails, investmentRequests]);
    console.log("recentRequestDetails in Dashboard : ", recentRequestDetails);
    console.log("requestDetails : ", requestDetails);
    console.log("investmentRequests : ", investmentRequests);
    const activeTabDetails = useMemo(() => {
        return details[activeTab];
    }, [activeTab]);

    return (
        <Grid container spacing={2} m={1}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >   
            <Box sx={{width: '80%' }}>
                <AppBar position="static" sx={{ backgroundColor: '#FF6B35', borderRadius: 1 }}>
                    <Toolbar>
                        {   
                            Object.keys(details).map((key) => (
                                <Button
                                    key={key}
                                    color="inherit"
                                    onClick={() => setActiveTab(key)}
                                    sx={activeTab === key ? activeTabStyle : undefined}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Button>
                            ))
                        }
                    </Toolbar>
                </AppBar>
            </Box>
            
            <RequestTables
                heading={activeTabDetails.heading}
                desc={activeTabDetails.desc}
                columns={activeTabDetails.columns}
                data={recentRequestDetails}
                type={activeTab}
                roleName={roleName}
            />
        </Grid>
    )
}

export default RequestDashboard

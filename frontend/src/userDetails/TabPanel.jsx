import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, Box, Card, CardContent, Fade, Slide, useTheme, useMediaQuery, Chip, Container, CircularProgress} from '@mui/material';
import { CalendarToday, TrendingUp, Schedule } from '@mui/icons-material';
import UserList from './UserList';
import dayjs from 'dayjs'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ComingSoonCard from '../comingSoonCard/ComingSoonCard';
import { useEffect } from 'react';
import { setMandalMembers, setUserContributedData } from '../redux/slice/slice';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contribution-tabpanel-${index}`}
      aria-labelledby={`contribution-tab-${index}`}
      style={{height: '100%'}}
      {...other}
    >
      {value === index && (
        <Fade in timeout={500}>
          <Box sx={{ p: { xs: 2, sm: 3 , height: '100%'} }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `contribution-tab-${index}`,
    'aria-controls': `contribution-tabpanel-${index}`,
  };
}

function getContributions(userContributedSelector) {
  try {
    let years = {
      "2025": [],
      "2026": [],
      "2027": []
    }
    let totalAmount = 0;
    userContributedSelector?.userList.forEach((item) => {
      const year = dayjs(item?.timestamp).year();
      if(years[year]) {
        years[year].push(item)
      }
      totalAmount += item?.contribution && Number (item?.contribution)
    })
    dispatch(setUserContributedData(years))
    dispatch(setMandalMembers(userContributedSelector))
  } catch (error) {
    console.log("Error while fetching user contribution: ", error?.message)
  }
}

export default function ContributionTabs() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const yearWiseData = useSelector((state) => state.role.userContributedData)
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [yearlyData, setYearlyData] = useState(yearWiseData[currentYear])
  const userContributedSelector = useSelector((state) => state.role.userContributedData)


  // console.log("yearlyData : ", yearlyData)
  // console.log("yearWiseData : ", yearWiseData)
  const handleChange = (event, newValue) => {
    setSelectedYear(tabsData[newValue].year)
    setYearlyData(yearWiseData[tabsData[newValue].year])
    setValue(newValue);
  };


  useEffect(() => {
    getContributions(userContributedSelector)
  }, [userContributedSelector])

  let tabsData = [];
  for(let year in yearWiseData) {
    let obj = {}
    obj.label = year;
    obj.year = year;
    if(year == currentYear) {
      obj.icon = <CalendarToday />;
      obj.active = true 
    } else{
      obj.icon =  <Schedule />;
      obj.active = false 
    }
    tabsData.push(obj)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Slide direction="down" in timeout={800}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
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
            Contribution Dashboard
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}
          >
            Track and manage contributions across different years for our Ganapati Mandal
          </Typography>
        </Box>
      </Slide>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0px 12px 40px rgba(255, 107, 53, 0.15)',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { md: '600px' },
          }}
        >
          {/* Tabs Navigation */}
          <Box
            sx={{
              borderRight: { md: 1 },
              borderBottom: { xs: 1, md: 0 },
              borderColor: 'divider',
              background: 'linear-gradient(180deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%)',
              minWidth: { md: 280 },
            }}
          >
            <Tabs
              orientation={isMobile ? 'horizontal' : 'vertical'}
              variant={isMobile ? 'fullWidth' : 'scrollable'}
              value={value}
              onChange={handleChange}
              aria-label="Contribution year tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  width: isMobile ? 3 : 4,
                  borderRadius: 2,
                },
                p: 2,
              }}
            >
              {tabsData.map((tab, index) => (
                <Tab
                  key={tab.year}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1,
                        px: 2,
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      {tab.icon}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                          }}
                        >
                          {tab.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            display: 'block',
                          }}
                        >
                          {tab.active ? 'Active Year' : 'Upcoming'}
                        </Typography>
                      </Box>
                      {tab.active && (
                        <Chip
                          label="Active"
                          size="small"
                          color="primary"
                          sx={{ ml: 'auto' }}
                        />
                      )}
                    </Box>
                  }
                  {...a11yProps(index)}
                  sx={{
                    alignItems: 'flex-start',
                    textTransform: 'none',
                    minHeight: 80,
                    borderRadius: 2,
                    mb: 1,
                    mx: 1,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 107, 53, 0.15)',
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <TabPanel value={value} index={value}>
              {
                yearWiseData[selectedYear] && yearWiseData[selectedYear].length > 0
                  ? <UserList selectedYear={selectedYear} userData={yearWiseData[selectedYear]} />
                  : selectedYear == currentYear
                    ? <Box data-id="progress-id" sx={{height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                        No Data found!
                      </Box>
                    : <ComingSoonCard year={selectedYear}/>
              }
            </TabPanel>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
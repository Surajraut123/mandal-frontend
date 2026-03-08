import React, { useMemo, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Fade, useTheme,
  Avatar, LinearProgress, CircularProgress,
  useMediaQuery, Chip, ToggleButton, ToggleButtonGroup,
  Stack, alpha, Button
} from '@mui/material';
import {
  AccountBalance, TrendingUp, People, Celebration,
  ArrowUpward, ArrowDownward, BarChart as BarChartIcon,
  ShowChart, KeyboardArrowRight,
  Savings, VolunteerActivism
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GanapatiImg from '../assets/ganapati.jpg';

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let color = '#';
  for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
  return color;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEMO_MONTHLY_CONTRIBUTIONS = [5000, 12000, 15000, 13000, 10000, 8000, 7000, 6000, 9000, 8000, 5000, 5000];
const DEMO_MONTHLY_INVESTMENTS = [2000, 8000, 10000, 15000, 12000, 5000, 3000, 4000, 6000, 10000, 5000, 3000];
const DEMO_TOP_CONTRIBUTORS = [
  { name: 'Amit Desai', amount: 31000 },
  { name: 'Priya Patel', amount: 21000 },
  { name: 'Rahul Sharma', amount: 20000 },
  { name: 'Vikram Joshi', amount: 16000 },
  { name: 'Sneha Kulkarni', amount: 8000 },
];
const DEMO_TOTAL_COLLECTION = 103000;
const DEMO_TOTAL_INVESTMENTS = 45000;
const DEMO_ACTIVE_MEMBERS = 18;
const DEMO_TOTAL_MEMBERS = 25;
const DEMO_CONTRIBUTORS_COUNT = 10;
const DEMO_TRANSACTIONS = 14;

const RANK_BG = ['#FFD700', '#C0C0C0', '#CD7F32', '#7C4DFF', '#9E9E9E'];
const RANK_FG = ['#B8860B', '#707070', '#8B4513', '#7C4DFF', '#757575'];

const MiniStat = ({ icon, title, value, trend, color }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${alpha(color, 0.06)} 0%, #fff 100%)`,
      border: `1px solid ${alpha(color, 0.1)}`,
      transition: 'all 0.25s ease',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 24px ${alpha(color, 0.15)}` },
    }}
  >
    <CardContent sx={{ p: { xs: '10px 12px !important', sm: '12px 16px !important' }, display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
      <Box sx={{ p: { xs: 0.8, sm: 1 }, borderRadius: 2, bgcolor: alpha(color, 0.1), color, display: 'flex', flexShrink: 0 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 500, display: 'block', lineHeight: 1.2, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
          {title}
        </Typography>
        <Typography noWrap sx={{ fontWeight: 700, color, lineHeight: 1.3, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
          {value}
        </Typography>
      </Box>
      {trend && (
        <Chip
          size="small"
          icon={trend.dir >= 0 ? <ArrowUpward sx={{ fontSize: 10 }} /> : <ArrowDownward sx={{ fontSize: 10 }} />}
          label={trend.label}
          sx={{
            height: 20, fontSize: '0.6rem', fontWeight: 600, flexShrink: 0,
            bgcolor: alpha(trend.dir >= 0 ? '#4CAF50' : '#F44336', 0.08),
            color: trend.dir >= 0 ? '#4CAF50' : '#F44336',
            '& .MuiChip-icon': { color: 'inherit', ml: '3px' },
            '& .MuiChip-label': { px: '4px' },
            display: { xs: 'none', sm: 'flex' },
          }}
        />
      )}
    </CardContent>
  </Card>
);

const Dashboard = ({ loader }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isCompact = isMobile || isTablet;
  const [period, setPeriod] = useState('weekly');

  const targetAmount = Number(import.meta.env.VITE_MANDAL_TOTAL_TARGET) || 300000;
  const getContributedDetails = useSelector((state) => state.role.getContributedDetails);
  const investmentRequests = useSelector((state) => state.role.investMentRequestsData);
  const mandalMembers = useSelector((state) => state.role.mandalMembers);

  const hasRealData = (getContributedDetails?.data?.length || 0) > 0;

  const { totalAmount, totalContributors } = useMemo(() => {
    if (!hasRealData) return { totalAmount: DEMO_TOTAL_COLLECTION, totalContributors: DEMO_CONTRIBUTORS_COUNT };
    const data = getContributedDetails?.data || [];
    return {
      totalAmount: data.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0),
      totalContributors: data.length,
    };
  }, [getContributedDetails, hasRealData]);

  const totalInvestments = useMemo(() => {
    if (!hasRealData) return DEMO_TOTAL_INVESTMENTS;
    return (investmentRequests?.data || []).reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  }, [investmentRequests, hasRealData]);

  const totalMembers = hasRealData ? (mandalMembers?.data || []).length : DEMO_TOTAL_MEMBERS;
  const activeMembers = useMemo(() => {
    if (!hasRealData) return DEMO_ACTIVE_MEMBERS;
    return (mandalMembers?.data || []).filter((m) => m.status === true || m.status === 'true').length;
  }, [mandalMembers, hasRealData]);

  const collectionRate = targetAmount > 0 ? ((totalAmount / targetAmount) * 100).toFixed(1) : 0;
  const netBalance = totalAmount - totalInvestments;

  const monthlyContributions = useMemo(() => {
    if (!hasRealData) return DEMO_MONTHLY_CONTRIBUTIONS;
    const arr = new Array(12).fill(0);
    (getContributedDetails?.data || []).forEach((c) => {
      const d = new Date(c.date || c.timestamp || c.createdAt);
      if (!isNaN(d)) arr[d.getMonth()] += parseFloat(c.amount || 0);
    });
    return arr;
  }, [getContributedDetails, hasRealData]);

  const monthlyInvestments = useMemo(() => {
    if (!hasRealData) return DEMO_MONTHLY_INVESTMENTS;
    const arr = new Array(12).fill(0);
    (investmentRequests?.data || []).forEach((inv) => {
      const d = new Date(inv.date || inv.timestamp || inv.createdAt);
      if (!isNaN(d)) arr[d.getMonth()] += parseFloat(inv.amount || 0);
    });
    return arr;
  }, [investmentRequests, hasRealData]);

  const cumulativeData = useMemo(() => {
    let r = 0;
    return monthlyContributions.map((v) => { r += v; return r; });
  }, [monthlyContributions]);

  const topContributors = useMemo(() => {
    if (!hasRealData) return DEMO_TOP_CONTRIBUTORS;
    const map = {};
    (getContributedDetails?.data || []).forEach((c) => {
      const name = c.donor_name || c.fullName || 'Unknown';
      map[name] = (map[name] || 0) + parseFloat(c.amount || 0);
    });
    return Object.entries(map).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [getContributedDetails, hasRealData]);
  const totalTransactions = hasRealData
    ? (getContributedDetails?.data?.length || 0) + (investmentRequests?.data?.length || 0)
    : DEMO_TRANSACTIONS;
  const avgContribution = totalContributors > 0 ? Math.round(totalAmount / totalContributors) : 0;
  const highestDonation = topContributors[0]?.amount || 0;

  const pieData = [
    { id: 0, value: totalAmount || 1, label: 'Collections', color: theme.palette.primary.main },
    { id: 1, value: totalInvestments || 1, label: 'Investments', color: '#AB47BC' },
    { id: 2, value: Math.max(netBalance, 0) || 1, label: 'Balance', color: '#4CAF50' },
  ];

  if (loader) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  const chartH = isMobile ? 200 : 260;

  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column',
        height: isCompact ? 'auto' : '100%',
        overflow: isCompact ? 'auto' : 'hidden',
        gap: 1.5, p: { xs: 0.5, sm: 1, md: 1.5 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={GanapatiImg} width="32px" style={{ borderRadius: 6 }} alt="" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, background: 'linear-gradient(45deg, #FF6B35, #D32F2F)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Analytics Dashboard
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Track contributions, investments & community growth
            </Typography>
          </Box>
        </Box>
        <ToggleButtonGroup
          value={period} exclusive size="small"
          onChange={(_, v) => v && setPeriod(v)}
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none', fontWeight: 600, px: { xs: 1, sm: 2 }, py: 0.4,
              fontSize: { xs: '0.7rem', sm: '0.8rem' }, border: '1px solid #e0e0e0',
              '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) },
            },
          }}
        >
          <ToggleButton value="yearly">Yearly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="weekly">Weekly</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
          gap: { xs: 1, sm: 1.5 },
        }}>
          {[
            { icon: <AccountBalance fontSize="small" />, title: 'Total Collection', value: `₹${totalAmount.toLocaleString('en-IN')}`, color: theme.palette.primary.main, trend: { dir: 1, label: `${collectionRate}%` } },
            { icon: <Savings fontSize="small" />, title: 'Investments', value: `₹${totalInvestments.toLocaleString('en-IN')}`, color: theme.palette.secondary.main, trend: null },
            { icon: <TrendingUp fontSize="small" />, title: 'Net Balance', value: `₹${netBalance.toLocaleString('en-IN')}`, color: '#4CAF50', trend: { dir: netBalance >= 0 ? 1 : -1, label: netBalance >= 0 ? 'Surplus' : 'Deficit' } },
            { icon: <People fontSize="small" />, title: 'Active Members', value: `${activeMembers}/${totalMembers}`, color: '#7C4DFF', trend: { dir: 1, label: 'Active' } },
            { icon: <VolunteerActivism fontSize="small" />, title: 'Contributors', value: totalContributors, color: '#FF9800', trend: null },
            { icon: <Celebration fontSize="small" />, title: 'Goal Progress', value: `${collectionRate}%`, color: '#E91E63', trend: { dir: 1, label: `₹${(targetAmount / 100000).toFixed(1)}L` } },
          ].map((s, i) => (
            <Fade in timeout={400 + i * 80} key={i}><Box><MiniStat {...s} /></Box></Fade>
          ))}
        </Box>
      </Box>

      <Card sx={{ flexShrink: 0, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
        <CardContent sx={{ p: '10px 16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, whiteSpace: 'nowrap', color: theme.palette.primary.main }}>
              Collection Goal
            </Typography>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(Number(collectionRate), 100)}
                sx={{
                  height: 10, borderRadius: 5,
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  '& .MuiLinearProgress-bar': { borderRadius: 5, background: `linear-gradient(90deg, ${theme.palette.primary.main}, #FF8A65)` },
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main, whiteSpace: 'nowrap' }}>
              ₹{totalAmount.toLocaleString('en-IN')} / ₹{targetAmount.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: 1.5, flexDirection: isCompact ? 'column' : 'row' }}>
        <Card sx={{ flex: 1.3, minWidth: 0, display: 'flex', flexDirection: 'column', border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
          <CardContent sx={{ p: '12px 16px !important', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ShowChart sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Collection Trend</Typography>
              </Box>
              <Chip label="This Month" size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main }} />
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <LineChart
                xAxis={[{ scaleType: 'point', data: MONTHS, tickLabelStyle: { fontSize: 11 } }]}
                series={[
                  { data: cumulativeData, label: 'Cumulative', color: theme.palette.primary.main, area: true, showMark: false, curve: 'natural' },
                  { data: monthlyContributions, label: 'Monthly', color: '#7C4DFF', showMark: false, curve: 'natural' },
                ]}
                height={chartH}
                margin={{ top: 30, bottom: 28, left: 55, right: 15 }}
                slotProps={{
                  legend: { direction: 'row', position: { vertical: 'top', horizontal: 'left' }, padding: { top: 0, left: 10 }, itemMarkWidth: 10, itemMarkHeight: 3, labelStyle: { fontSize: 11, fontWeight: 500 } },
                }}
                sx={{ '& .MuiAreaElement-root': { opacity: 0.12 } }}
              />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 0.7, minWidth: 0, display: 'flex', flexDirection: 'column', border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
          <CardContent sx={{ p: '12px 16px !important', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <BarChartIcon sx={{ color: theme.palette.secondary.main, fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Monthly Revenue</Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: MONTHS, tickLabelStyle: { fontSize: 11 } }]}
                series={[
                  { data: monthlyContributions, label: 'In', color: theme.palette.primary.main },
                  { data: monthlyInvestments, label: 'Out', color: alpha('#AB47BC', 0.45) },
                ]}
                height={chartH}
                margin={{ top: 30, bottom: 28, left: 55, right: 15 }}
                slotProps={{
                  legend: { direction: 'row', position: { vertical: 'top', horizontal: 'right' }, padding: { top: 0, right: 10 }, itemMarkWidth: 10, itemMarkHeight: 10, labelStyle: { fontSize: 11, fontWeight: 500 } },
                }}
                borderRadius={3}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ flex: 0.8, minHeight: 0, display: 'flex', gap: 1.5, flexDirection: isCompact ? 'column' : 'row', flexShrink: 0 }}>

        <Card sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
          <CardContent sx={{ p: '12px 16px !important', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Top Contributors</Typography>
              <Button
                size="small"
                endIcon={<KeyboardArrowRight sx={{ fontSize: 16 }} />}
                onClick={() => navigate('/user-details')}
                sx={{ textTransform: 'none', fontSize: '0.7rem', fontWeight: 600, p: 0, color: theme.palette.primary.main }}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', px: 1, py: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 1, mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ flex: 1, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.5 }}>Name</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ width: 75, textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.5 }}>Amount</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ width: 50, textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.5 }}>Rank</Typography>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {topContributors.map((c, i) => (
                <Box
                  key={c.name}
                  sx={{
                    display: 'flex', alignItems: 'center', px: 1, py: 0.8,
                    borderBottom: `1px solid ${alpha('#000', 0.04)}`,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
                  }}
                >
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem', fontWeight: 700, bgcolor: stringToColor(c.name) }}>
                      {c.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500, fontSize: '0.8rem' }}>{c.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ width: 75, textAlign: 'right', fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.8rem' }}>
                    ₹{c.amount.toLocaleString('en-IN')}
                  </Typography>
                  <Box sx={{ width: 50, display: 'flex', justifyContent: 'center' }}>
                    <Chip
                      label={i + 1}
                      size="small"
                      sx={{
                        height: 22, minWidth: 22, fontSize: '0.7rem', fontWeight: 700,
                        bgcolor: alpha(RANK_BG[i] || '#9E9E9E', 0.2),
                        color: RANK_FG[i] || '#757575',
                        '& .MuiChip-label': { px: '6px' },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 0.8, minWidth: 0, display: 'flex', flexDirection: 'column', border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
          <CardContent sx={{ p: '12px 16px !important', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Fund Distribution</Typography>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart
                series={[{
                  data: pieData,
                  innerRadius: isMobile ? 35 : 50,
                  outerRadius: isMobile ? 65 : 85,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  highlightScope: { fade: 'global', highlight: 'item' },
                }]}
                width={isMobile ? 250 : 280}
                height={isMobile ? 180 : 220}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'top', horizontal: 'middle' },
                    padding: { top: 0 },
                    itemMarkWidth: 10,
                    itemMarkHeight: 10,
                    labelStyle: { fontSize: 11, fontWeight: 500 },
                    itemGap: 16,
                  },
                }}
                margin={{ top: 30, bottom: 10, left: 10, right: 10 }}
              />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 0.8, minWidth: 0, display: 'flex', flexDirection: 'column', border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
          <CardContent sx={{ p: '12px 16px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Quick Insights</Typography>
            <Stack spacing={1.2} sx={{ flex: 1 }}>
              {[
                { label: 'Avg. Contribution', value: `₹${avgContribution.toLocaleString('en-IN')}`, color: theme.palette.primary.main },
                { label: 'Highest Donation', value: `₹${highestDonation.toLocaleString('en-IN')}`, color: theme.palette.primary.main },
                { label: 'Transactions', value: totalTransactions, color: '#7C4DFF' },
                { label: 'Efficiency', value: `${collectionRate}%`, color: '#E91E63' },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    py: 0.8, borderBottom: `1px solid ${alpha('#000', 0.05)}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: item.color, fontSize: '0.85rem' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Button
              fullWidth variant="contained" size="small"
              onClick={() => navigate('/add-contribution')}
              sx={{ mt: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', py: 1, borderRadius: 2 }}
            >
              + Add Contribution
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;

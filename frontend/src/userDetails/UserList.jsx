import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Box, Avatar, Typography, Chip, Card, CardContent, Fade, useTheme, IconButton, Tooltip } from '@mui/material';
import { AccountBalance, TrendingUp, Edit, Visibility } from '@mui/icons-material';
import dayjs from 'dayjs'
const columns = [
  { id: 'avatar', label: '', minWidth: 80, align: 'center' },
  { id: 'fullName', label: 'Full Name', minWidth: 180 },
  { id: 'amount', label: 'Contribution (₹)', minWidth: 150, align: 'right' },
  { id: 'date', label: 'Date', minWidth: 120, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 120, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' },
];

function createData(contributor, theme) {
  const amount = contributor?.contribution
  const status = contributor?.status
  ? contributor.status.charAt(0).toUpperCase() + contributor.status.slice(1)
  : "";

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'InActive': return 'error';
      default: return 'default';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  return {
    avatar: (
      <Tooltip title={`${contributor?.fullName}\n${contributor?.email}\n${contributor?.phone}`} arrow>
        <Avatar
          sx={{
            width: 50,
            height: 50,
            background: `linear-gradient(45deg, ${theme?.palette?.primary?.main || '#FF6B35'}, ${theme?.palette?.tertiary?.main || '#FFC107'})`,
            fontWeight: 700,
            fontSize: '1.1rem',
            border: '3px solid rgba(255, 107, 53, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0px 8px 20px rgba(255, 107, 53, 0.3)',
            },
          }}
        >
          {getInitials(contributor.fullName)}
        </Avatar>
      </Tooltip>
    ),
    fullName: contributor.fullName,
    amount: `₹${amount.toLocaleString()}`,
    date: contributor?.timestamp,
    status: (
      <Chip
        label={status}
        color={getStatusColor(status)}
        size="small"
        sx={{
          fontWeight: 600,
          minWidth: 80,
        }}
      />
    ),
    actions: (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Tooltip title="View Details" arrow>
          <IconButton
            size="small"
            sx={{
              color: theme?.palette?.primary?.main || '#FF6B35',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Contribution" arrow>
          <IconButton
            size="small"
            sx={{
              color: theme?.palette?.secondary?.main || '#D32F2F',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  };
}

export default function ContributionTable({selectedYear, userData}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();

  // console.log("Userdata : ", userData)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  let totalAmount = 0;
  const userContributors = userData.map((data) => {
    totalAmount += Number(data?.contribution) || 0;
    return {
      fullName : data?.fullName,
      status : data?.status,
      contribution : data?.contribution || 0,
      timestamp : dayjs(data?.timestamp).format("MM/DD/YYYY"),
      profileImage : data?.profileImage || ""
    }
  })

  // console.log("userContributors : ", userContributors)

  const useRows = () => {
    const theme = useTheme();
    return React.useMemo(() => userContributors.map(contributor => createData(contributor, theme)), [theme]);
  };

  const rows = useRows();

  console.log("Rows: == ", rows)

  const paidAmount = 0;
  const pendingAmount = 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Fade in timeout={600}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <AccountBalance sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Total Collection
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Fade>

        <Fade in timeout={800}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <TrendingUp sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                Collected
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                ₹{paidAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Fade>

        <Fade in timeout={1000}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <AccountBalance sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                Pending
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                ₹{pendingAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </Box>

      <Fade in timeout={1200}>
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: 3,
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
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <Fade in timeout={300 + index * 50} key={`${row.name}-${index}`}>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 53, 0.05)',
                              transform: 'scale(1.01)',
                            },
                            transition: 'all 0.2s ease-in-out',
                            cursor: 'pointer',
                          }}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
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
                                {column.id === 'name' ? (
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 600,
                                      color: theme.palette.text.primary,
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                ) : column.id === 'amount' ? (
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 700,
                                      color: theme.palette.primary.main,
                                      fontSize: '1.1rem',
                                    }}
                                  >
                                    {value}
                                  </Typography>
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

          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(255, 107, 53, 0.05)',
              borderTop: '1px solid rgba(255, 107, 53, 0.1)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                textAlign: 'center',
              }}
            >
              Total Contributors: {rows.length} | Total Amount: ₹{totalAmount.toLocaleString()}
            </Typography>
          </Box>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: 'rgba(255, 107, 53, 0.02)',
              '& .MuiTablePagination-toolbar': {
                color: theme.palette.primary.main,
              },
              '& .MuiTablePagination-selectIcon': {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Paper>
      </Fade>
    </Box>
  );
}
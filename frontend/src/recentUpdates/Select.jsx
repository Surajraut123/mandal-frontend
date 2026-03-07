import { FormControl, Select, MenuItem, Box, Typography, CircularProgress, OutlinedInput, InputAdornment } from '@mui/material';
import StatusStyle from '../statusStyleDialog/StatusStyle';

export default function CommonSelect({ value, onChange, options, isUserAgreed }) {
  return (
    <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Select
        fullWidth
        value={value}
        onChange={onChange}
        input={
            isUserAgreed && <OutlinedInput
                sx={{
                    paddingRight: "2rem"
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <CircularProgress size={18} />
                    </InputAdornment>
                }
            />
          }
        renderValue={(selected) => {
        const selectedStatus = options.find(opt => opt.value === selected)?.label || selected;
          return (
            <StatusStyle status={selectedStatus} />
          );
        }}
      >
        {options.map((opt) => {

          return (
            <MenuItem
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

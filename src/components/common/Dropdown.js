import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**

 * @param {string} label - عنوان الحقل
 * @param {any} value - القيمة المختارة
 * @param {function} onChange - حدث تغيير القيمة
 * @param {Array<{value: any, label: string}>} options - الخيارات
 */
const Dropdown = ({ label, value, onChange, options, name }) => {
  const labelId = `${name}-label`;
  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
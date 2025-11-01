/**
 * 사용자단(비회원) > 공통레이아웃 > MUI 셀렉트박스
 *
 * @author kimJS
 * @since 2025.10.23
 * @version 0.1.0
 */
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectSmall() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Age</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>지역선택</em>
        </MenuItem>
        <MenuItem value={11}>서울특별시</MenuItem>
        <MenuItem value={26}>부산광역시</MenuItem>
        <MenuItem value={30}>대구광역시</MenuItem>
      </Select>
    </FormControl>
  );
}

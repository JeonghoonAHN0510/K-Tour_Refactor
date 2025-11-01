/**
 * K-Tour > 사용자단 MUIIcons 컴포넌트
 * https://mui.com/material-ui/material-icons/
 *
 * @author kimJS
 * @since 2025.10.22
 * @version 0.1.0
 */
//import { TwoToneColorExample } from "@user/components/common/MuiIcons"; // MUI 아이콘 컴포넌트

import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { Box } from '@mui/material';

export default function TwoToneColorExample( props ) {
  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {/* 기본 색상: 회색 + 흐릿한 회색 */}
      <FavoriteTwoToneIcon sx={{ fontSize: 60 }} />
      
      {/* 색상 변경: 주황색 계열의 투톤으로 변경 */}
      <FavoriteTwoToneIcon sx={{ color: 'orange', fontSize: 60 }} />
      
      {/* 색상 변경: 보라색 계열의 투톤으로 변경 */}
      <FavoriteTwoToneIcon sx={{ color: '#9C27B0', fontSize: 60 }} />
    </Box>
  );
}

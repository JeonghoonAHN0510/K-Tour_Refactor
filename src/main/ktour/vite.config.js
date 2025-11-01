import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'; // **Vite Alias(경로 별칭) : 상대 경로 대신  간단한 별칭(절대 경로) 사용

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '찾을 별칭': '실제 경로'
      // '@' 별칭을 현재 프로젝트의 'src' 폴더로 연결
      '@': path.resolve(__dirname, './src'), 
      '@admin': path.resolve(__dirname, './src/admin'),
      '@user': path.resolve(__dirname, './src/user'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
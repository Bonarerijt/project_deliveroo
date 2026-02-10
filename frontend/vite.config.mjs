import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const fallbackApiUrl = mode === 'production'
        ? 'https://project-deliveroo.onrender.com'
        : 'http://localhost:8000'
    const apiUrl = env.REACT_APP_API_URL || fallbackApiUrl

    return {
        plugins: [react()],
        define: {
            'process.env.REACT_APP_API_URL': JSON.stringify(apiUrl)
        }
    }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    define:{
        'process.env': {} //vite中 {}process.env 已经被移除了。解决办法是在 vite.config.ts 中增加 define：
    },
    plugins: [
        vue(),
        electron({
            // 主进程入口文件
            entry: 'background.js',          
        })
    ],
    /*开发服务器选项*/
    server: {
        // 端口
        port: 3000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src') // @的别名配置
        }
    }
})

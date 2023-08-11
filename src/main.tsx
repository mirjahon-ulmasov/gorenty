import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, ThemeConfig } from 'antd'
import { Toaster } from 'react-hot-toast'
import { setupStore } from 'store/store'

import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"

dayjs.extend(weekday)
dayjs.extend(localeData)

import App from './App'
import 'animate.css'
import 'assets/scss/styles.scss'

const theme: ThemeConfig = {
    token: {
        colorPrimary: '#FF561F',
        // colorBgBase: '#F8F8F8',
        fontSize: 14,
        fontFamily: 'Inter',
    },
    components: {
        Table: {},
        Typography: {
            titleMarginBottom: 0,
        },
    },
}

const store = setupStore()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ConfigProvider theme={theme}>
                    <Toaster />
                    <App />
                </ConfigProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)

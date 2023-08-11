import { ReactNode } from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'
import { ROLE } from 'types/index'
import MainHeader from './Header'
import Sidebar from './Sidebar'

const { Content } = Layout

interface LayoutProps {
    role: ROLE;
    children: ReactNode
}

export default function MainLayout({ role, children }: LayoutProps) {
    return (
        <Layout>
            <MainHeader />
            <Layout hasSider>
                <Sidebar userRole={role}/>
                <StyledContent>{children}</StyledContent>
            </Layout>
        </Layout>
    )
}

const StyledContent = styled(Content)`
    max-height: calc(100vh - 114px);
    padding: 32px;
    margin: 16px 24px;
    overflow: hidden auto;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.02);
`
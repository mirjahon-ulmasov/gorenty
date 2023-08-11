import { css, styled } from 'styled-components'
interface PropTypes<T> {
    tabs: {
        value: T
        title: string
    }[]
    activeTab: T
    onTabChange: (tab: T) => void
}

export function Tabs<T>({ tabs, activeTab, onTabChange }: PropTypes<T>) {
    function handleTabClick(tab: T) {
        onTabChange(tab)
    }

    return (
        <StyledTabs>
            {tabs.map((tab, index) => (
                <Tab
                    key={index}
                    is_active={activeTab === tab.value ? 1 : 0}
                    onClick={() => handleTabClick(tab.value)}
                >
                    {tab.title}
                </Tab>
            ))}
        </StyledTabs>
    )
}

const StyledTabs = styled.ul`
    display: flex;
    gap: 16px;
    margin: 2rem 0;
`

const Tab = styled.li<{ is_active: number }>`
    list-style: none;
    font-weight: 500;
    padding-bottom: 10px;
    transition: 0.2s all;
	cursor: pointer;
    border-bottom: 2px solid transparent;

    ${props =>
        props.is_active &&
        css`
            color: #ff561f;
            border-bottom: 2px solid #ff561f;
        `}
`

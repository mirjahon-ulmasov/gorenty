import { Image, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

const { Text } = Typography

export const StyledTextL1 = styled(Text)<{ fs?: number }>`
    font-weight: 400;
    color: rgba(27, 16, 5, 0.88);
    font-size: ${props => (props.fs ? `${props.fs}px` : '14px')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '22px')};
`

export const StyledTextL2 = styled(Text)<{ fs?: number }>`
    font-weight: 600;
    font-size: ${props => (props.fs ? `${props.fs}px` : '16px')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '24px')};
`

export const StyledLink = styled(Link)`
    color: #ff561f;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;

    &:hover {
        color: #eb3a00;
    }
`

export const IDTag = styled.div`
    background: rgba(27, 16, 5, 0.06);
    border-radius: 4px;
    padding: 5px 8px;
    min-width: max-content;
    color: rgba(27, 16, 5, 0.88);
`

export const Label = styled.div`
    border-radius: 4px;
    padding: 8px;
    font-size: 16px;
    color: rgba(27, 16, 5, 0.65);
    background: rgba(27, 16, 5, 0.02);
`

export const BorderBox = styled.div<{ bg?: string; p?: string; gap?: string }>`
    display: flex;
    justify-content: space-between;
    border-radius: 8px;
    border: 1px solid rgba(27, 16, 5, 0.06);
    gap: ${props => (props.gap ? props.gap : '2px')};
    padding: ${props => (props.p ? props.p : '12px')};
    background: ${props => (props.bg ? props.bg : '#fff')};

    a {
        color: inherit;
        cursor: pointer;
        font-weight: inherit;
        border-bottom: 1px solid;
    }
    &.bill {
        gap: 4px;
        padding: 8px 16px;

        &.income {
            background: #f0fff5;
        }
        &.outgoings {
            background: #fff1f0;
        }
    }
`

export const BillingHistory = styled.div`
    height: 100%;
    padding: 24px;
    border-radius: 8px;
    background: rgba(27, 16, 5, 0.02);
`

export const OrderCard = styled(BillingHistory)`
    height: max-content;
    border-radius: 4px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.03),
        0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.02);
`

export const SmallImg = styled(Image)<{ w?: number; h?: number }>`
    width: ${props => props.w ? `${props.w}px` : '90px' };
    height: ${props => props.h ? `${props.h}px` : '90px' };
    border-radius: 4px;
    object-fit: cover;
    object-position: center;
`

export const Card = styled.div<{ w?: number, p?: string, gap?: number, ai?: string}>`
    display: flex;
    width: ${props => props.w ? `${props.w}px` : 'auto'};
    padding: ${props => props.p ? props.p : '24px 32px'};
    flex-direction: column;
    gap: ${props => props.gap ? `${props.gap}px` : '8px'};
    align-items: ${props => props.ai ? props.ai : 'flex-start'};
    border-radius: 16px;
    background: #FFF3EB;
    transition: 0.2s ease-in;

    &:hover {
        background: #FFD9C2;
    }
`
import { Image, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

const { Text } = Typography

export const StyledText = styled(Text)<{ fs?: number, fw?: number, color?: string }>`
    font-weight: ${props => (props.fw ? props.fw : 400)};
    font-size: ${props => (props.fs ? `${props.fs}px` : '16px')};
    color: ${props => (props.color ? props.color : 'var(--black-65)')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '22px')};
`

export const StyledTextL1 = styled(Text)<{ fs?: number }>`
    font-weight: 400;
    color: var(--black-88);
    font-size: ${props => (props.fs ? `${props.fs}px` : '14px')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '22px')};
`

export const StyledTextL2 = styled(Text)<{ fs?: number, color?: string }>`
    font-weight: 600;
    color: ${props => (props.color ? props.color : 'inherit')};
    font-size: ${props => (props.fs ? `${props.fs}px` : '16px')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '24px')};
`

export const StyledLink = styled(Link)<{ color?: string, underline?: number, fs?: number, fw?: number }>`
    line-height: 24px;
    font-weight: ${props => (props.fw ? props.fw : 400)};
    font-size: ${props => (props.fs ? `${props.fs}px` : '16px')};
    color: ${props => (props.color ? props.color : '#ff561f')} ;
    text-decoration-line: ${props => props.underline ? 'underline' : 'none'};

    &:hover {
        color: ${props => (props.color ? props.color : '#eb3a00')} ;
    }
`

export const IDTag = styled.div`
    background: rgba(27, 16, 5, 0.06);
    border-radius: 4px;
    padding: 5px 8px;
    min-width: max-content;
    color: var(--black-88);
`

export const Label = styled.div`
    border-radius: 4px;
    padding: 8px;
    font-size: 16px;
    color: rgba(27, 16, 5, 0.65);
    background: rgba(27, 16, 5, 0.02);
`

export const LargeLabel = styled(Label)`
    border-radius: 8px;
    padding: 24px;
`

export const BorderBox = styled.div<{ bg?: string; p?: string; gap?: string }>`
    display: flex;
    flex-wrap: wrap;
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
        text-decoration: underline;
        /* border-bottom: 1px solid; */
    }

    &.bill {
        gap: 4px;
        padding: 8px 16px;
        border-color: rgba(27, 16, 5, 0.15);

        &.income {
            background: #f0fff5;
        }
        &.outgoings {
            background: #fff1f0;
        }
        &.debt {
            border-color: #FF4D4F;
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

export const LogList = styled.div<{ mh?: number, gap?: number}>`
    width: 100%;
    display: flex;
    overflow: auto;
    flex-direction: column;
    padding-right: 1rem;
    gap: ${props => props.gap ? `${props.gap}px` : '12px'};
    max-height: ${props => props.mh ? `${props.mh}rem` : '24rem'};
`

export const ButtonIcon = styled.button<{ p?: number }>`
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5F5F5;
    border: 1px solid #1b100526;
    padding: ${props => props.p ? props.p : '3px'};
`
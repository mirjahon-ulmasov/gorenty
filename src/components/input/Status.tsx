import { css, styled } from 'styled-components'
import { CLIENT_STATUS, ALL_STATUS, CAR_STATUS, ORDER_STATUS } from 'types/index'
import { format } from 'utils/index'

export const Status = styled.span<{ value?: ALL_STATUS; type?: format }>`
    font-size: 14px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;

    color: #555;
    background: #e6f4ff;
    border: 1px solid #aaa;

    ${props =>
        props.type === 'client' && props.value === CLIENT_STATUS.NEW &&
        css`
            color: #1677ff;
            background: #e6f4ff;
            border: 1px solid #4096ff;
        `}

    ${props =>
        props.type === 'client' && props.value === CLIENT_STATUS.VIP &&
        css`
            color: #722ed1;
            background: #f9f0ff;
            border: 1px solid #b37feb;
        `}
        
    ${props =>
        (props.value === CAR_STATUS.BLOCK || props.value === CLIENT_STATUS.BLOCK) &&
        css`
            color: #ff4d4f;
            background: #fff1f0;
            border: 1px solid #ffa39e;
        `}

    ${props =>
        props.type === 'car' && props.value === CAR_STATUS.BUSY &&
        css`
            color: var(--primary);
            background: var(--primary-bg);
            border: 1px solid var(--primary);
        `}

    ${props =>
        props.type === 'car' && props.value === CAR_STATUS.FREE &&
        css`
            color: #1bbe72;
            background: #f0fff5;
            border: 1px solid #1bbe72;
        `}

    ${props =>
        props.type === 'order' && props.value === ORDER_STATUS.BOOKED &&
        css`
            color: #722ed1;
            background: #f9f0ff;
            border: 1px solid #b37feb;
        `}

    ${props =>
        props.type === 'order' && props.value === ORDER_STATUS.CREATED &&
        css`
            color: #1bbe72;
            background: #f0fff5;
            border: 1px solid #1bbe72;
        `}
`

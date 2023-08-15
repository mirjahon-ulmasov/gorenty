import { CheckCircle } from 'components/input'
import clsx from 'clsx'
import styled from 'styled-components'
import { ALL_STATUS } from 'types/index'

interface Status<T> {
    title: string
    value: T
}

interface SelectStatusProps<T> {
    statuses: Status<T>[]
    activeStatus?: T
    onSelectStatus: (status: T) => void
}

export function StatusSelect<T extends ALL_STATUS>({ statuses, activeStatus, onSelectStatus }: SelectStatusProps<T>) {
    const handleStatusClick = (status: T) => {
        onSelectStatus(status)
    }

    return (
        <StatusList>
            {statuses.map((status, index) => (
                <Status
                    key={index}
                    onClick={() => handleStatusClick(status.value)}
                    className={clsx(activeStatus === status.value && 'active')}
                >
                    {activeStatus === status.value && <CheckCircle />}
                    {status.title}
                </Status>
            ))}
        </StatusList>
    )
}

const StatusList = styled.ul`
    display: flex;
    gap: 12px;
    margin-top: 4px;
`

const Status = styled.li`
    display: flex;
    width: 110px;
    padding: 4px 16px;
    gap: 4px;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: #FFF;
    border: 1px solid rgba(27, 16, 5, 0.15);
    box-shadow: 0px 2px 0px 0px rgba(27, 16, 5, 0.02);
    cursor: pointer;
    transition: 0.2s ease-in;

    &.active {
        border: 1px solid #64D99A;
        background: #F0FFF5;
    }
`
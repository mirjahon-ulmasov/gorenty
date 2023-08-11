import { Link } from 'react-router-dom'
import { styled } from 'styled-components'
import { Breadcrumb } from 'antd'

interface BreadcrumbItem {
    title: string
    link?: string
}
interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export function CustomBreadcrumb({ items }: BreadcrumbsProps) {
    return (
        <StyledBreadcrumb
            items={items.map(item => ({
                title: item.link ? (
                    <Link to={item.link}>{item.title}</Link>
                ) : (
                    item.title
                ),
            }))}
        />
    )
}

const StyledBreadcrumb = styled(Breadcrumb)`
    margin-bottom: 1rem;

    .ant-breadcrumb-link {
        color: rgba(27, 16, 5, 0.25);
        font-weight: 500;
        a {
            color: #ff561f;
            font-weight: 600;

            &:hover {
                background: none;
                color: #ff561f;
                border-radius: 0;
                border-bottom: 1px solid #ff561f;
            }
        }
    }
`

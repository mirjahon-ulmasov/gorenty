/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Space, Table, Col, Row, Typography, Popover } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface'
import type { TableProps } from 'antd'
import { isArray } from 'lodash'
import { useFetchInvestorsQuery } from 'services/investor'
import { getColumnSearchProps } from 'utils/search'
import type { Investor } from 'types/api'
import { DownloadIcon, FilterIcon, PlusIcon } from 'assets/images/Icons'

const { Title } = Typography

interface TableDTO extends Investor.DTO {
    key: string
}

// Filter
const text = <span>Title</span>

const content = (
    <div>
        <p>Content</p>
        <p>Content</p>
    </div>
)

export default function Investors() {
    const navigate = useNavigate()
    const [sorters, setSorters] = useState<SorterResult<TableDTO>[]>([]);    
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({}) 

    const { data: investors } = useFetchInvestorsQuery({
        object_index: isArray(filters?.id) ? filters?.id[0].toString() : '',
        full_name: isArray(filters?.full_name) ? filters?.full_name[0].toString() : '',
        phone_number: isArray(filters?.phone_number) ? filters?.phone_number[0].toString() : '',
        ordering: sorters
            .filter(sorter => sorter.order)
            .map(sorter => `${sorter.order === "ascend" ? '' : '-'}${sorter.field}`)
            .join(',')
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return investors?.results?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [investors])

    // ---------------- Table Change ----------------
    const handleChange: TableProps<TableDTO>['onChange'] = (_pagination, _filters, sorter) => {
        setFilters(_filters);        

        if (!sorter) return;

        const sorterArray = Array.isArray(sorter) ? sorter : [sorter];
        sorterArray.forEach((element) => {
            if(!element.field) return;

            const sortIndex = sorters.findIndex((item) => item.field === element.field);
            if(sortIndex === -1) {
                setSorters(prev => [...prev, element])
                return;
            }
            const updatedSorters = [...sorters];
            updatedSorters[sortIndex].order = element.order;
            setSorters(updatedSorters)
        })
    };

    const columns: ColumnsType<TableDTO> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 150,
            key: 'id',
            sorter: true,
            ellipsis: true,
            ...getColumnSearchProps('object_index', 'ID'),
        },
        {
            title: 'Investor',
            dataIndex: 'full_name',
            key: 'full_name',
            ellipsis: true,
            ...getColumnSearchProps('full_name', 'Investor'),
        },
        {
            title: 'Telefon raqam',
            dataIndex: 'phone_number',
            key: 'phone_number',
            ellipsis: true,
            ...getColumnSearchProps('phone_number', 'Telefon raqam'),
        },
        {
            title: 'Investor balansi',
            dataIndex: 'balanse',
            key: 'balanse',
            sorter: true,
            render: (_, record) => record.balance?.toLocaleString(),
        },
        {
            title: 'Avtomobillar soni',
            dataIndex: 'vehicles_count',
            key: 'vehicles_count',
            sorter: true,
        },
    ]

    const rowProps = (record: TableDTO) => {
        return {
            onClick: () =>
                navigate('/investor/'
                    .concat((record.id as number).toString(), '/detail')
                ),
        }
    }

    return (
        <>
            <Row justify="space-between" style={{ marginBottom: '2rem' }}>
                <Col>
                    <Title level={3}>Investorlar</Title>
                </Col>
                <Col>
                    <Space size="middle">
                        <Popover placement="bottomRight" title={text} content={content} trigger="click">
                            <Button icon={<FilterIcon />}>Filtrlash</Button>
                        </Popover>
                        <Button icon={<DownloadIcon />}>
                            Yuklash
                        </Button>
                        <Button onClick={() => navigate('/investor/add')} className='d-flex' icon={<PlusIcon />}>
                            Yangi investor qo’shish
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                pagination={{ pageSize: 30 }}
                scroll={{ y: 500 }}
                onRow={rowProps}
            />
        </>
    )
}

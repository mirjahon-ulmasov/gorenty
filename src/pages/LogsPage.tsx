/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from 'react'
import { Button, Table, Typography } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface'
import type { TableProps } from 'antd'
import { isArray } from 'lodash'
import { useFetchClientsQuery } from 'services/client'
import { getColumnSearchProps } from 'utils/search'
import { getStatus } from 'utils/index'
import type { Client } from 'types/api'
import { CLIENT_STATUS } from 'types/index'
import { Status, DownloadIcon } from 'components/input'

const { Title } = Typography

interface TableDTO extends Client.DTO {
    key: string
}

export function LogsPage() {
    const [sorters, setSorters] = useState<SorterResult<TableDTO>[]>([]);    
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({})  

    const { data: clients } = useFetchClientsQuery({
        object_index: isArray(filters?.id) ? filters?.id[0].toString() : '',
        status: isArray(filters?.status) ? filters?.status.join() : '',
        full_name: isArray(filters?.full_name) ? filters?.full_name[0].toString() : '',
        phone_number: isArray(filters?.phone_number) ? filters?.phone_number[0].toString() : '',
        ordering: sorters
            .filter(sorter => sorter.order)
            .map(sorter => `${sorter.order === "ascend" ? '' : '-'}${sorter.field}`)
            .join(',')
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return clients?.results?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [clients])

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
            key: 'id',
            width: 150,
            sorter: true,
            ellipsis: true,
            ...getColumnSearchProps('object_index', 'ID'),
        },
        {
            title: 'Mijoz',
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <Status value={record.status as CLIENT_STATUS} type='client'>
                    {getStatus(record.status as CLIENT_STATUS, 'client')}
                </Status>
            ),
            filters: [
                {
                    text: getStatus(CLIENT_STATUS.NEW, 'client'),
                    value: CLIENT_STATUS.NEW,
                },
                {
                    text: getStatus(CLIENT_STATUS.VIP, 'client'),
                    value: CLIENT_STATUS.VIP,
                },
                {
                    text: getStatus(CLIENT_STATUS.BLOCK, 'client'),
                    value: CLIENT_STATUS.BLOCK,
                },
            ],
            filterSearch: true,
        },
        {
            title: 'Mijoz balansi',
            dataIndex: 'balance',
            key: 'balance',
            sorter: true,
            render: (_, record) => record.balance?.toLocaleString(),
        },
        {
            title: 'Buyurtmalar soni',
            dataIndex: 'orders_count',
            key: 'orders_count',
            sorter: true,
        },
    ]


    return (
        <>
            <div className='d-flex jc-sb mb-2'>
                <Title level={3}>O’zgarishlar jurnali</Title>
                <Button icon={<DownloadIcon />}>Yuklash</Button>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                pagination={{ pageSize: 30 }}
                scroll={{ y: 500 }}
            />
        </>
    )
}

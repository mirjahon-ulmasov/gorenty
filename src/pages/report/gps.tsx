import { Typography, TableProps, Table, Button } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { CustomBreadcrumb, DownloadIcon } from 'components/input'
import { useMemo, useState } from 'react';
import { isArray } from 'lodash';
import { getColumnSearchProps } from 'utils/search';
import { useFetchOrdersQuery } from 'services/order';
import data from "./data/table.json"

const { Title } = Typography

interface TableDTO {
    key: string;
}

export default function GPSReport() {
    const [sorters, setSorters] = useState<SorterResult<TableDTO>[]>([]);    
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({})
    
    const { data: _data } = useFetchOrdersQuery({
        object_index: isArray(filters?.id) ? filters?.id[0].toString() : '',
        vehicle_plate_number: isArray(filters?.vehicle_plate) ? filters?.vehicle_plate[0].toString() : '',
        ordering: sorters
            .filter(sorter => sorter.order)
            .map(sorter => `${sorter.order === "ascend" ? '' : '-'}${sorter.field}`)
            .join(',')
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return data?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [])

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
            ...getColumnSearchProps('object_index', 'ID'),
        },
        {
            title: 'Avtomobil',
            dataIndex: "vehicle_plate",
            key: 'vehicle_plate',
            ellipsis: true,
            ...getColumnSearchProps('vehicle_plate', 'Avtomobil'),
        },
        {
            title: 'GPS qo’yilgan sana',
            dataIndex: 'end_date',
            key: 'end_date',
            sorter: true,
        },
        {
            title: 'Investor',
            dataIndex: "vehicle_plate",
            key: 'vehicle_plate',
            ellipsis: true,
            ...getColumnSearchProps('vehicle_plate', 'Investor'),
        },
        {
            title: 'Summa',
            dataIndex: 'rest_day',
            key: 'rest_day',
            sorter: true,
        },
    ]

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Moliyaviy hisobotlar', link: '/admin/report' },
                    { title: 'GPS' },
                ]}
            />
            <div className='d-flex jc-sb ai-center mt-1 mb-2'>
                <Title level={3}>GPS</Title>
                <Button icon={<DownloadIcon />}>
                    Yuklash
                </Button>
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

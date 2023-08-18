import { Typography, DatePicker, TableProps, Table } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { CustomBreadcrumb } from 'components/input'
import { useMemo, useState } from 'react';
import { getColumnSearchProps } from 'utils/search';
import data from "./data/table.json"
import { isArray } from 'lodash';
import { useFetchOrdersQuery } from 'services/order';

const { Title } = Typography
const { RangePicker } = DatePicker

interface TableDTO {
    key: string;
}

export default function Insurance() {
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
            title: 'Tonirovka tugash sanasi',
            dataIndex: 'end_date',
            key: 'end_date',
            sorter: true,
        },
        {
            title: 'Qolgan kun',
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
                    { title: 'Sug’urta' },
                ]}
            />
            <div className='d-flex jc-sb ai-center mt-1 mb-2'>
                <Title level={3}>Sug’urta</Title>
                <RangePicker />
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

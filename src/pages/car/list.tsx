import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space, Table, Col, Row, Typography, Popover, Checkbox } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isArray } from 'lodash';
import type { TableProps } from 'antd';
import type { Car, CarBrand } from 'types/api';
import { useFetchCarsQuery } from 'services';
import { DownloadIcon, FilterIcon, PlusIcon } from 'assets/images/Icons';
import { getColumnSearchProps } from 'utils/search';
import { Status } from 'components/input';
import { getStatus } from 'utils/index';
import { CAR_STATUS } from 'types/index';

const { Title } = Typography

interface TableDTO extends Car.DTO {
    key: string;
}

export default function Cars() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [openFilter, setOpenFilter] = useState(false);
    const [sorters, setSorters] = useState<SorterResult<TableDTO>[]>([]);    
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({})        

    const { data: orders } = useFetchCarsQuery({
        investor: state?.investor,
        object_index: isArray(filters?.id) ? filters?.id[0].toString() : '',
        status: isArray(filters?.status) ? filters?.status.join() : '',
        full_name: isArray(filters?.investor) ? filters?.investor[0].toString() : '',
        plate_number: isArray(filters?.plate_number) ? filters?.plate_number[0].toString() : '',
        ordering: sorters
            .filter(sorter => sorter.order)
            .map(sorter => `${sorter.order === "ascend" ? '' : '-'}${sorter.field}`)
            .join(',')
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return orders?.results?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [orders])

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

    // ----------- Filter -----------
    const onChange = (e: CheckboxChangeEvent) => {
        console.log(`checked = ${e.target.checked}`);
    };
    function toggleFilter(newOpen: boolean) {
        setOpenFilter(newOpen);
    }
    const closeFilter = () => {
        setOpenFilter(false);
    };
    const FilterContent = (
        <div className='d-flex fd-col gap-8 ai-start' style={{ padding: '12px 12px 6px' }}>
            <Checkbox onChange={onChange}>Remont - bajarilganlar</Checkbox>
            <Checkbox onChange={onChange}>Remont - bajarilmaganlar</Checkbox>
            <Checkbox onChange={onChange}>Muddati o’tib ketganlar</Checkbox>
            <Checkbox onChange={onChange}>Jarimasi mavjudlar</Checkbox>
            <div style={{ marginTop: 10 }}>
                <Space size='small'>
                    <Button type='primary' size='middle' htmlType='submit'>Tasdiqlash</Button>
                    <Button size='middle' onClick={closeFilter}>Bekor qilish</Button>
                </Space>
            </div>
        </div>
    );

    // --------------------------------

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
            title: 'Davlat raqami',
            dataIndex: 'plate_number',
            key: 'plate_number',
            ellipsis: true,
            ...getColumnSearchProps('plate_number', 'Davlat raqami'),
        },
        {
            title: 'Avtomobil turi',
            dataIndex: 'brand',
            key: 'brand',
            ellipsis: true,
            render: (_, record) => (record.brand as CarBrand.DTO).title
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <Status value={record.status as CAR_STATUS} type='car'>
                    {getStatus(record.status as CAR_STATUS, 'car')}
                </Status>
            ),
            filters: [
                {
                    text: getStatus(CAR_STATUS.FREE, 'car'),
                    value: CAR_STATUS.FREE,
                },
                {
                    text: getStatus(CAR_STATUS.BUSY, 'car'),
                    value: CAR_STATUS.BUSY,
                },
                {
                    text: getStatus(CAR_STATUS.BLOCK, 'car'),
                    value: CAR_STATUS.BLOCK,
                },
            ],
            filterSearch: true,
        },
        {
            title: 'Investor',
            dataIndex: 'investor',
            key: 'investor',
            ellipsis: true,
            ...getColumnSearchProps('investor.full_name', 'Investor'),
        },
        {
            title: 'Yurgan kilometri',
            dataIndex: 'mileage',
            key: 'mileage',
            sorter: true,
        },
    ]

    const rowProps = (record: TableDTO) => {
        return {
            onClick: () =>
                navigate('/car/'.concat((record.id as number).toString(), '/detail')),
        }
    }

    return (
        <>
            <Row justify="space-between" style={{ marginBottom: '2rem' }}>
                <Col>
                    <Title level={3}>Avtomobillar</Title>
                </Col>
                <Col>
                    <Space size='middle'>
                        <Popover open={openFilter} onOpenChange={toggleFilter} placement="bottomRight" content={FilterContent} trigger="click">
                            <Button icon={<FilterIcon />}>Filtrlash</Button>
                        </Popover>
                        <Button icon={<DownloadIcon />}>
                            Yuklash
                        </Button>
                        <Button 
                            icon={<PlusIcon />}
                            className='d-flex' 
                            onClick={() => navigate('/car/add')} 
                        >
                            Yangi avtomobil qo’shish
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

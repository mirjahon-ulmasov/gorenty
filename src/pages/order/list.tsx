import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space, Table, Col, Row, Typography, Popover, Checkbox } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isArray } from 'lodash';
import type { TableProps } from 'antd';
import type { Order, Pagination } from 'types/api';
import { useFetchOrdersQuery } from 'services';
import { DownloadIcon, FilterIcon, PlusIcon } from 'components/input';
import { getColumnSearchProps } from 'utils/search';
import { Tabs } from 'components/input';
import { ORDER_STATUS } from 'types/index';

const { Title } = Typography;

interface TableDTO extends Order.DTO {
    key: string;
}

const tabs = [
    { value: ORDER_STATUS.CREATED, title: 'Aktiv buyurtmalar'},
    { value: ORDER_STATUS.BOOKED, title: 'Bron qilinganlar'},
    { value: ORDER_STATUS.FINISHED, title: 'Tugagan buyurtmalar'},
    { value: ORDER_STATUS.CANCELLED, title: 'Bekor qilinganlar'},
]

export default function Orders() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [openFilter, setOpenFilter] = useState(false);
    const [activeTab, setActiveTab] = useState(ORDER_STATUS.CREATED)
    const [sorters, setSorters] = useState<SorterResult<TableDTO>[]>([]);    
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({})    
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        page_size: 10
    })    

    const { data: orders } = useFetchOrdersQuery({
        ...pagination,
        status: activeTab,
        customer: state?.customer,
        vehicle: state?.vehicle,
        investor: state?.investor,
        object_index: isArray(filters?.id) ? filters?.id[0].toString() : '',
        customer_full_name: isArray(filters?.client) ? filters?.client[0].toString() : '',
        vehicle_plate_number: isArray(filters?.plate_number) ? filters?.plate_number[0].toString() : '',
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
    const handleChange: TableProps<TableDTO>['onChange'] = (_pagination, filters, sorter) => {
        setFilters(filters);

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
            title: 'Mijoz',
            dataIndex: ['customer', 'full_name'],
            key: 'client',
            ellipsis: true,
            ...getColumnSearchProps('customer.full_name', 'Mijoz'),
        },
        {
            title: 'Avtomobil turi',
            dataIndex: ['vehicle', 'brand', 'title'],
            key: 'brand',
            ellipsis: true,
        },
        {
            title: 'Avtomobil',
            dataIndex: ['vehicle', 'plate_number'],
            key: 'plate_number',
            ellipsis: true,
            ...getColumnSearchProps('vehicle.plate_number', 'Avtomobil'),
        },
        {
            title: 'Olingan sana',
            dataIndex: 'start_date',
            key: 'start_date',
            sorter: true,
        },
        {
            title: 'Tugash sanasi',
            dataIndex: 'end_date',
            key: 'end_date',
            sorter: true,
        },
    ]

    const rowProps = (record: TableDTO) => {
        return {
            onClick: () =>
                navigate('/order/'
                    .concat((record.id as number).toString(), '/detail')
                ),
        }
    }

    return (
        <>
            <Row justify="space-between">
                <Col>
                    <Title level={3}>Buyurtmalar</Title>
                </Col>
                <Col>
                    <Space size='middle'>
                        <Popover open={openFilter} onOpenChange={toggleFilter} placement="bottomRight" content={FilterContent} trigger="click">
                            <Button icon={<FilterIcon />}>Filtrlash</Button>
                        </Popover>
                        <Button icon={<DownloadIcon />}>
                            Yuklash
                        </Button>
                        <Button icon={<PlusIcon />} className='d-flex' onClick={() => navigate('/order/add')}>
                            Yangi buyurtma ochish
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(tab) => setActiveTab(tab)} 
            />
            <Table
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                onRow={rowProps}
                pagination={{
                    total: orders?.count,
                    current: pagination.page,
                    pageSize: pagination.page_size,
                    pageSizeOptions: [10, 20, 50, 100],
                    position: ['bottomCenter'], 
                    onChange(page, page_size) {
                        setPagination({ page, page_size})
                    },
                }}
                scroll={{ y: 600 }} // x: 1200
                footer={() => orders?.count 
                    ? `${orders?.count} ta ma’lumot topildi` 
                    : 'Ma’lumot topilmadi'
                }
            />
        </>
    );
}
        

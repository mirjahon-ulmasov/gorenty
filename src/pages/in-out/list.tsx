import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Table, Col, Row, Typography } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { isArray } from 'lodash';
import type { TableProps } from 'antd';
import type { Order } from 'types/api';
import { useFetchOrdersQuery } from 'services';
import { getColumnSearchProps } from 'utils/search';
import { 
    DownloadIcon, LargeLabel, PaymentCardIcon, 
    PlusIcon, StyledTextL1, StyledTextL2 
} from 'components/input';

const { Title } = Typography;

interface TableDTO extends Order.DTO {
    key: string;
}

export default function InOuts() {
    const navigate = useNavigate()
    const [sorters, setSorters] = useState<SorterResult<TableDTO>[]>([]);    
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({})        

    const { data: orders } = useFetchOrdersQuery({
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
            title: 'Turi',
            dataIndex: ['customer', 'full_name'],
            key: 'client',
            ellipsis: true,
        },
        {
            title: 'Filial',
            dataIndex: ['vehicle', 'brand', 'title'],
            key: 'brand',
            ellipsis: true,
        },
        {
            title: 'To’lov turi',
            dataIndex: ['vehicle', 'plate_number'],
            key: 'plate_number',
            ellipsis: true,
        },
        {
            title: 'Summa',
            dataIndex: 'start_date',
            key: 'start_date',
            sorter: true,
        },
        {
            title: 'Kategoriya',
            dataIndex: ['vehicle', 'plate_number'],
            key: 'plate_number',
            ellipsis: true,
            ...getColumnSearchProps('object_index', 'Kategoriya'),
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
                navigate('/admin/in-out/'
                    .concat((record.id as number).toString(), '/detail')
                ),
        }
    }

    return (
        <>
            <Row justify="space-between">
                <Col>
                    <Title level={3}>Kirim-chiqim</Title>
                </Col>
                <Col>
                    <Space size='middle'>
                        <Button 
                            icon={<PaymentCardIcon />}
                            className='d-flex' 
                            onClick={() => navigate('/admin/in-out/payment-type')} 
                        >
                            To’lov turlari
                        </Button>
                        <Button 
                            icon={<PlusIcon />}
                            className='d-flex' 
                            onClick={() => navigate('/admin/in-out/add')} 
                        >
                            Kirim-chiqim qilish
                        </Button>
                        <Button icon={<DownloadIcon />}>
                            Yuklash
                        </Button>
                    </Space>
                </Col>
            </Row>
            <LargeLabel className='mt-2 mb-2'>
                <Space size='large'>
                    <Space size='small'>
                        <StyledTextL1>Hozirda filiallardagi naqd pul:</StyledTextL1>
                        <StyledTextL2>30 000 000 so’m</StyledTextL2>
                    </Space>
                    <Space size='small'>
                        <StyledTextL1>Bugungi kirim:</StyledTextL1>
                        <StyledTextL2>90 000 000 so’m</StyledTextL2>
                    </Space>
                    <Space size='small'>
                        <StyledTextL1>Bugungi chiqim:</StyledTextL1>
                        <StyledTextL2>-20 000 000 so’m</StyledTextL2>
                    </Space>
                </Space>
            </LargeLabel>
            <Table
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                pagination={{ pageSize: 30 }}
                scroll={{ y: 500 }}
                onRow={rowProps}
            />
        </>
    );
}
        

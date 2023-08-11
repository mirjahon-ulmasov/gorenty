import { useParams } from 'react-router-dom'
import { Typography } from 'antd'
import { CustomBreadcrumb } from 'components/input'

const { Title } = Typography

// interface TableDTO extends Client.NullableDTO {
//     key: string
// }

// const dataSource: TableDTO[] = fakeData.results.map((el, idx) => ({
//     ...el,
//     key: idx.toString(),
// }))

export default function InvestorStatistics() {
    const { investorID } = useParams();

    // const columns: ColumnsType<TableDTO> = [
    //     {
    //         title: 'ID',
    //         dataIndex: 'id',
    //         key: 'id',
    //         ellipsis: true,
    //         ...getColumnSearchProps('id', 'ID'),
    //     },
    //     {
    //         title: 'Mijoz',
    //         dataIndex: 'full_name',
    //         key: 'full_name',
    //         ellipsis: true,
    //         ...getColumnSearchProps('full_name', 'Mijoz'),
    //     },
    //     {
    //         title: 'Status',
    //         dataIndex: 'status',
    //         key: 'status',
    //         render: (_, record) => (
    //             <Status type={record.status}>
    //                 {/* {getStatus(record.status)} */}
    //             </Status>
    //         ),
    //         filters: [
    //             // {
    //             //     text: getStatus(ClientStatus.NEW),
    //             //     value: ClientStatus.NEW,
    //             // },
    //             // {
    //             //     text: getStatus(ClientStatus.VIP),
    //             //     value: ClientStatus.VIP,
    //             // },
    //             // {
    //             //     text: getStatus(ClientStatus.BLOCK),
    //             //     value: ClientStatus.BLOCK,
    //             // },
    //         ],
    //         filterSearch: true,
    //         onFilter: (value, record) => record.status === value,
    //     },
    //     {
    //         title: 'Mijoz balansi',
    //         dataIndex: 'balanse',
    //         key: 'balanse',
    //         render: (_, record) => record.balanse?.toLocaleString(),
    //         sorter: (a, b) => {
    //             const newA = a.balanse || 0
    //             const newB = b.balanse || 0
    //             return newA - newB
    //         },
    //     },
    //     {
    //         title: 'Buyurtmalar soni',
    //         dataIndex: 'orders_count',
    //         key: 'orders_count',
    //         sorter: (a, b) => {
    //             const newA = a.orders_count || 0
    //             const newB = b.orders_count || 0
    //             return newA - newB
    //         },
    //     },
    // ]

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Investorlar', link: '/investor' },
                    { title: 'Raxmatov Shoxrux', link: `/investor/${investorID}/detail` },
                    { title: 'Investor moliyaviy hisobotlari' },
                ]}
            />
            <Title level={3}>Investor moliyaviy hisobotlari</Title>
            <Title level={5} style={{ marginBottom: '1rem' }}>Avtomobillar</Title>
            {/* <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 30 }}
                scroll={{ y: 500 }}
            /> */}
        </>
    )
}

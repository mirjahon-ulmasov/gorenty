import { Typography, Row, Col, DatePicker, Space, Select, Divider } from 'antd'
import { Line } from '@ant-design/plots'
import { Bar } from '@ant-design/plots'
import { CustomBreadcrumb } from 'components/input'
import { useEffect, useMemo, useState } from 'react'
import { getBarConfig, getLineConfig } from 'utils/config'

import barData from "./data/bar.json"

const { Title } = Typography
const { RangePicker } = DatePicker

export default function Toning() {
    const [lineData, setLineData] = useState([])

    useEffect(() => {
        asyncFetch()
    }, [])

    const asyncFetch = () => {
        fetch(
            'https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json'
        )
            .then(response => response.json())
            .then(json => setLineData(json))
            .catch(error => {
                console.log('fetch data failed', error)
            })
    }

    const lineConfig = useMemo(() => getLineConfig(lineData), [lineData])
    const barConfig = useMemo(() => getBarConfig(barData), [])

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Moliyaviy hisobotlar', link: '/admin/report' },
                    { title: 'Buyurtmalar soni' },
                ]}
            />
            <Title level={3}>Buyurtmalar soni</Title>
            <Row gutter={[0, 32]}>
                <Col span={24}>
                    <div className='d-flex jc-sb ai-center mt-2'>
                        <Title level={5}>
                            Vaqt bo’yicha barcha buyurtmalar soni
                        </Title>
                        <RangePicker />
                    </div>
                    <Line color='#FF561F' {...lineConfig} className='mt-2' />
                </Col>
                <Divider style={{ margin: '10px 0'}}/>
                <Col span={24}>
                    <Title level={5}>
                        Kategoriya bo’yicha barcha buyurtmalar soni
                    </Title>
                    <div className='d-flex jc-sb ai-center mt-2'>
                        <Space size='middle'>
                            <Select
                                defaultValue="lucy"
                                style={{ width: 120 }}
                                allowClear
                                options={[{ value: 'lucy', label: 'Lucy' }]}
                            />
                            <Select
                                defaultValue="lucy"
                                style={{ width: 120 }}
                                allowClear
                                options={[{ value: 'lucy', label: 'Lucy' }]}
                            />
                        </Space>
                        <RangePicker />
                    </div>
                    <Line {...lineConfig} className='mt-2' />
                </Col>
                <Divider style={{ margin: '10px 0'}}/>
                <Col span={24}>
                    <Title level={5}>
                        Buyurtmalar soni reytingi
                    </Title>
                    <div className='d-flex jc-sb ai-center mt-2'>
                        <Select
                            defaultValue="lucy"
                            style={{ width: 120 }}
                            allowClear
                            options={[{ value: 'lucy', label: 'Lucy' }]}
                        />
                        <RangePicker />
                    </div>
                    <Bar color='#1BBE72' {...barConfig} className='mt-2' />
                </Col>
            </Row>
        </>
    )
}

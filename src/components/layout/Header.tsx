import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Divider, Layout, Space, Button } from 'antd'
import styled from 'styled-components'
import { HArrowCircleIcon, HBellIcon } from 'components/input'
import { CustomSelect } from 'components/input'
import logo from '/logo.png'

const { Header } = Layout

const options = [
    { value: 'order', label: 'Buyurtma' },
    { value: 'client', label: 'Mijoz' },
    { value: 'investor', label: 'Investor' },
    { value: 'car', label: 'Avtomobil' },
];

export default function MainHeader() {
    const navigate = useNavigate();
    const [module, setModule] = useState('order');

    function changeModuleHandler(value: any) {
        setModule(value)
    }

    return (
        <CustomHeader>
            <img src={logo} alt="Logo" />
            <div className='d-flex jc-sb w-100'>
                <Space size='large'>
                    <div className="d-flex fd-col ai-start gap-4">
                        <span className='black-88 fw-500 fs-16'>1$ = 11 200 So’m</span>
                        <div className='d-iflex gap-4'>
                            <HArrowCircleIcon />
                            <span className='black-65 fw-400 fs-14'>12.03.2023</span>
                        </div>
                    </div>
                    <Divider type='vertical' style={{ height: 42 }} />
                    <div className="d-flex fd-col ai-start gap-4">
                        <span className='black-88 fw-500 fs-16'>32 ta bo’sh avtomobil</span>
                        <div className='d-iflex'>
                            <span className='black-65 fw-500 fs-14'>87 ta avtomobil band</span>
                        </div>
                    </div>
                </Space>
                <Space size='large'>
                    <Space.Compact size='large' style={{ width: 350 }}>
                        <CustomSelect value={module} onChange={changeModuleHandler} options={options} />
                        <CustomSelect
                            showSearch
                            style={{ width: 400 }}
                            placeholder="Qidirish"
                            onChange={(value) => navigate(`/${module}/${value}/detail`)}
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toString().includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                            }
                            options={[
                            {
                                value: '1',
                                label: 'Not Identified',
                            },
                            {
                                value: '2',
                                label: 'Closed',
                            },
                            {
                                value: '3',
                                label: 'Communicated',
                            },
                            {
                                value: '4',
                                label: 'Identified',
                            },
                            {
                                value: '5',
                                label: 'Resolved',
                            },
                            {
                                value: '6',
                                label: 'Cancelled',
                            },
                            ]}
                        />
                    </Space.Compact>
                    <Button size='large' icon={
                        <span style={{ position: 'relative' }}>
                            <HBellIcon />
                            <Dot/>
                        </span>
                    }>
                        Xabarlar (5)
                    </Button>
                </Space>
            </div>
        </CustomHeader>
    )
}

const CustomHeader = styled(Header)`
    height: 82px;
    display: flex;
    padding: 20px 32px;
    align-items: center;
    background-color: #fff;

    img {
        width: 160px;
        height: auto;
        margin-right: 6rem;
    }
    * {
        line-height: 18px;
    }
`

const Dot = styled.span`
    position: absolute;
    top: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    background: #FF561F;    
    border-radius: 50%;
`
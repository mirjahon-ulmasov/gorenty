/* eslint-disable no-constant-condition */
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { 
    Button, Col, DatePickerProps, 
    Row, Space, Typography, Form, 
    InputNumber, Modal 
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { 
    CustomBreadcrumb, CustomDatePicker, Payment, 
    Status, BillingHistory, BorderBox, IDTag, 
    Label, StyledLink, StyledTextL1, StyledTextL2  
} from 'components/input'
import { formatPhone, getStatus } from 'utils/index'
import { CLIENT_STATUS } from 'types/index'
import { useFetchClientQuery } from 'services/client'
import { TBranch } from 'types/api'
import { LockIcon } from 'assets/images/Icons'

const { Title } = Typography

export default function ClientDetail() {
    const navigate = useNavigate()
    const { clientID } = useParams()

    const [modal, contextHolder] = Modal.useModal();
    const [isOpenPayment, setIsOpenPayment] = useState(false);

    const { data: client } = useFetchClientQuery(clientID as string)

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const confirm = () => {
        modal.confirm({
            title: 'Buyurtmani yopmoqchimisiz?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <Form>
                    <Form.Item
                        name="note"
                        label="Avtomobilni yurgan kilometrini kiriting"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[]}
                    >
                        <InputNumber size="large" placeholder="100000" style={{ width: '100%' }}/>
                    </Form.Item>
                </Form>
            ),
            okText: 'Tasdiqlsh',
            cancelText: 'Bekor qilish',
            centered: true
        });
    };

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Mijozlar', link: '/client/list' },
                    { title: client?.full_name ?? '-' },
                ]}
            />
            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div className='d-flex jc-sb gap-8 fw-wrap'>
                                <IDTag>{client?.object_index}</IDTag>
                                <Title level={3}>{client?.full_name ?? '-'}</Title>
                                <Space size="small">
                                    <Button
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/client/'.concat(
                                                    clientID?.toString() as string,
                                                    '/edit'
                                                )
                                            )
                                        }
                                    >
                                        O’zgartirish
                                    </Button>
                                    <Button 
                                        className='d-flex' 
                                        size="large" 
                                        type='default' 
                                        onClick={confirm} icon={<LockIcon />}
                                    >
                                        Blok
                                    </Button>
                                </Space>
                            </div>  
                        </Col>
                        <Col span={24}>
                            <Row gutter={[12, 12]}>
                                <Col span={24}>
                                    <Label>Mijozning joriy balansi</Label>
                                </Col>
                                <Col span={24}>
                                    <BorderBox p='20px 12px'>
                                        <Title level={3}>{client?.balance?.toLocaleString()}</Title>
                                        <Space>
                                            <Button size="middle" onClick={() => setIsOpenPayment(true)}>
                                                Balansni to’ldirish
                                            </Button>
                                            <Button size="middle">
                                                Balansni yechish
                                            </Button>
                                        </Space>
                                    </BorderBox>
                                </Col>
                                {isOpenPayment && (
                                    <Col span={24}>
                                        <Payment onClose={() => setIsOpenPayment(false)} />
                                    </Col>
                                )}
                                <Col span={24}>
                                    <Label>Mijoz ma’lumotlari</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Adrress</StyledTextL1>
                                        <StyledTextL2>{client?.address || '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Status</StyledTextL1>
                                        <StyledTextL2>
                                            <Status value={client?.status as CLIENT_STATUS} type='client'>
                                                {getStatus(client?.status as CLIENT_STATUS, 'client')}
                                            </Status>
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Telefon raqami</StyledTextL1>
                                        <StyledTextL2>{formatPhone(client?.phone_number ?? '-')}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Qo’shilgan filial</StyledTextL1>
                                        <StyledTextL2>{(client?.branch as TBranch)?.title ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={24}>
                                    <StyledLink to='/order/list' className='ml-1'>
                                        Mijozga tegishli buyurtmalar {client?.orders_count}
                                    </StyledLink>
                                </Col>
                                <Col span={24} className='mt-1'>
                                    <Label>Haydovchilik guvohnmasi va passport ma’lumotlari</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Haydovchilik guvohnomasi</StyledTextL1>
                                        <StyledTextL2>{client?.license || "-"}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Passport</StyledTextL1>
                                        <StyledTextL2>{client?.passport_number || '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={24} className='mt-1'>
                                    <Label>Mijoz statistikasi</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Mijoz keltirgan foyda</StyledTextL1>
                                        <StyledTextL2>67 000 000 so’m</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Mijoz keltirgan zarar</StyledTextL1>
                                        <StyledTextL2>17 000 000 so’m</StyledTextL2>
                                    </BorderBox>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <BillingHistory>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Row justify='space-between' align='middle' className='gap-8'>
                                    <Col>
                                        <Title level={5}>Hisob-kitob tarixi</Title>
                                    </Col>
                                    <Col>
                                        <Space size='small'>
                                            <Button size='middle' onClick={() => setIsOpenPayment(true)}>
                                                Harajat qo’shish
                                            </Button>
                                            <CustomDatePicker placeholder='Sana' size='middle' onChange={onChange} />
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                            {isOpenPayment && (
                                <Col span={24}>
                                    <Payment onClose={() => setIsOpenPayment(false)} />
                                </Col>
                            )}
                            <Col span={24}>
                                <BorderBox className={clsx('bill', true ? 'income' : 'outgoings')}>
                                    <div className='d-flex jc-sb w-100'>
                                        <div className='d-flex ai-start fd-col gap-4'>
                                            <StyledTextL2>Balans to’ldirish</StyledTextL2>
                                            <StyledTextL1>Asaka bank</StyledTextL1>
                                        </div>
                                        <div className='d-flex ai-end fd-col gap-4'>
                                            <StyledTextL2>+500 000 so’m</StyledTextL2>
                                            <StyledTextL1>23-Mart, 2023</StyledTextL1>
                                        </div>
                                    </div>
                                </BorderBox>
                            </Col>
                            <Col span={24}>
                                <BorderBox className={clsx('bill', false ? 'income' : 'outgoings')}>
                                    <div className='d-flex jc-sb w-100 gap-4'>
                                        <div className='d-flex ai-start fd-col gap-4'>
                                            <StyledTextL2>Gorenty jarima</StyledTextL2>
                                            <StyledTextL1>
                                                <Link to={'/order/'.concat('N341232', '/detail')}>
                                                    Buyurtma N341232
                                                </Link>    
                                            </StyledTextL1>
                                        </div>
                                        <div className='d-flex ai-end fd-col gap-4'>
                                            <StyledTextL2>+500 000 so’m</StyledTextL2>
                                            <StyledTextL1>23-Mart, 2023</StyledTextL1>
                                        </div>
                                    </div>
                                </BorderBox>
                            </Col>
                            <Col span={24}>
                                <BorderBox className={clsx('bill', true ? 'income' : 'outgoings')}>
                                    <div className='d-flex jc-sb w-100'>
                                        <div className='d-flex ai-start fd-col gap-4'>
                                            <StyledTextL2>Gai jarima</StyledTextL2>
                                            <StyledTextL1>
                                                <Link to={'/order/'.concat('N341232', '/detail')}>
                                                    Buyurtma N341232
                                                </Link>
                                            </StyledTextL1>
                                        </div>
                                        <div className='d-flex ai-end fd-col gap-4'>
                                            <StyledTextL2>+500 000 so’m</StyledTextL2>
                                            <StyledTextL1>23-Mart, 2023</StyledTextL1>
                                        </div>
                                    </div>
                                </BorderBox>
                            </Col>
                            <Col span={24}>
                                <BorderBox className={clsx('bill', false ? 'income' : 'outgoings')}>
                                    <div className='d-flex jc-sb w-100'>
                                        <div className='d-flex ai-start fd-col gap-4'>
                                            <StyledTextL2>Balansni yechish</StyledTextL2>
                                            <StyledTextL1>Asaka bank</StyledTextL1>
                                        </div>
                                        <div className='d-flex ai-end fd-col gap-4'>
                                            <StyledTextL2>+500 000 so’m</StyledTextL2>
                                            <StyledTextL1>23-Mart, 2023</StyledTextL1>
                                        </div>
                                    </div>
                                </BorderBox>
                            </Col>
                        </Row>
                    </BillingHistory>
                </Col>
            </Row>
            {contextHolder}
        </>
    )
}


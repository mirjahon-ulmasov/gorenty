/* eslint-disable no-constant-condition */
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
    Button, Col, DatePickerProps, 
    Row, Space, Typography, 
    Checkbox, Modal, Form, InputNumber 
} from 'antd'
import clsx from 'clsx';
import moment from 'moment'
import { 
    CustomBreadcrumb, Payment, Label, 
    StyledTextL1, StyledTextL2, BorderBox, 
    CustomDatePicker, SmallImg, IDTag, 
    StyledLink, BillingHistory, Status  
} from 'components/input'
import { BucketFile, CarBrand, Investor } from 'types/api'
import { useFetchCarQuery } from 'services/car'
import { LockIcon } from 'assets/images/Icons'
import { CAR_STATUS } from 'types/index';
import { getStatus } from 'utils/index';

const { Title } = Typography

export default function CarDetail() {
    const navigate = useNavigate()
    const { carID } = useParams()
    const [modal, contextHolder] = Modal.useModal();
    const [isOpenPayment, setIsOpenPayment] = useState(false);

    const { data: car } = useFetchCarQuery(carID as string)

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
                    { title: 'Avtomobillar', link: '/car/list' },
                    { title: car?.plate_number ?? '-' },
                ]}
            />
            <Row gutter={[48, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div className='d-flex jc-sb gap-8 fw-wrap'>  
                                <IDTag>{car?.object_index}</IDTag>
                                <Title level={3}>{car?.plate_number ?? '-'}</Title>
                                <Space size="small">
                                    <Button
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/car/'.concat(
                                                    carID?.toString() as string,
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
                                    <Label>Avtomobil ma’lumotlari</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Davlat raqami</StyledTextL1>
                                        <StyledTextL2>{car?.plate_number ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Status</StyledTextL1>
                                        <StyledTextL2>
                                            <Status value={car?.status as CAR_STATUS} type='car'>
                                                {getStatus(car?.status as CAR_STATUS, 'car') ?? '-'}
                                            </Status>
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Avtomobil markasi</StyledTextL1>
                                        <StyledTextL2>{(car?.brand as CarBrand.DTO)?.title ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Avtomobil modeli</StyledTextL1>
                                        <StyledTextL2>{car?.model ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={24}>
                                    <BorderBox className='d-flex jc-start fw-wrap gap-12'>
                                        {(car?.vehicle_images as BucketFile[])?.map((el) => (
                                            <SmallImg key={el.id} src={el.image.file} alt='car' />
                                        ))}
                                    </BorderBox>
                                </Col>
                                <Col span={24}>
                                    <StyledLink to='/order/list' className='ml-1'>
                                        Avtomobilga tegishli buyurtmalar
                                    </StyledLink>
                                </Col>

                                <Col span={24} className='mt-1'>
                                    <Label>Avtomobil investori</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Investor ism-sharifi</StyledTextL1>
                                        <StyledTextL2>{(car?.investor as Investor.DTO)?.full_name}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Investor ulushi</StyledTextL1>
                                        <StyledTextL2>
                                            {car?.investor_share ? car.investor_share + '%' : '-'}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>

                                <Col span={24} className='mt-1'>
                                    <Label>To’lov</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Kunlik summa</StyledTextL1>
                                        <StyledTextL2>{car?.payment?.toLocaleString() ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Kilometr bo’yicha jarima</StyledTextL1>
                                        <StyledTextL2>{car?.fine_payment?.toLocaleString() ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>

                                <Col span={24} className='mt-1'>
                                    <Label>Avotmobil ko’rsatichlari</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Yurgan yo’li (km)</StyledTextL1>
                                        <StyledTextL2>{car?.mileage?.toLocaleString() ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Gorentyda yurgan yo’li (km)</StyledTextL1>
                                        <StyledTextL2>{car?.go_renty_mileage?.toLocaleString() ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Sug’urta muddati</StyledTextL1>
                                        <StyledTextL2>
                                            {moment(car?.insurance as string).format('LL')}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                {car?.is_toned && (
                                    <Col span={12}>
                                        <BorderBox className='fd-col'>
                                            <StyledTextL1>Tonirovka muddati</StyledTextL1>
                                            <StyledTextL2>
                                                {moment(car?.toning as string).format('LL')}
                                            </StyledTextL2>
                                        </BorderBox>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <BillingHistory>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Row justify='space-between' align='middle' className='gap-8'>
                                    <Col><Title level={5}>Harajatlar tarixi</Title></Col>
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
                                    <Payment note={true} onClose={() => setIsOpenPayment(false)} />
                                </Col>
                            )}
                            {[
                                {title: 'Moyka', source: 'Naqd - Sergeli Filial', amount: '300 000 so’m', is_finished: null},
                                {title: 'Moyka', source: 'Humokarta Tenge Bank', amount: '300 000 so’m', is_finished: null},
                                {title: 'Remont', source: null, order_id: '0709202300001', amount: '300 000 so’m', is_finished: false},
                                {title: 'Remont', source: 'Humokarta Tenge Bank', order_id: '0709202300002', amount: '300 000 so’m', is_finished: true}
                            ].map((el, index) => (
                                <Col span={24} key={index}>
                                    <BorderBox className={clsx('bill', (el.is_finished || el.is_finished === null) ? 'income' : 'outgoings')}>
                                        <div className='d-flex fd-col ai-start gap-12 w-100'>
                                            <div className='d-flex jc-sb w-100'>
                                                <div className='d-flex ai-start fd-col gap-4'>
                                                    <StyledTextL2>{el.title}</StyledTextL2>
                                                    <StyledTextL1>
                                                        {el.order_id 
                                                            ? (
                                                                <Link to={'/order/'.concat('N341232', '/detail')}>
                                                                    Buyurtma {el.order_id}
                                                                </Link>
                                                            )  
                                                            : el.source
                                                        }
                                                    </StyledTextL1>
                                                </div>
                                                <div className='d-flex ai-end fd-col gap-4'>
                                                    <StyledTextL2>{el.amount}</StyledTextL2>
                                                    <StyledTextL1>23-Mart, 2023</StyledTextL1>
                                                </div>
                                            </div>
                                            {el.is_finished !== null && (
                                                <>
                                                    {el.is_finished ? (
                                                        <Checkbox checked={el.is_finished}>
                                                            <StyledTextL1 fs={16}>Bajarildi (14:00, 28-mart, 2023 y)</StyledTextL1>
                                                        </Checkbox>
                                                    ) : (
                                                        <>
                                                            <Button type='default' onClick={() => setIsOpenPayment(true)}>
                                                                Bajarish
                                                            </Button> 
                                                            {isOpenPayment && (
                                                                <Payment category={false} amount={false} btnText='Tasdiqlash' onClose={() => setIsOpenPayment(false)} />
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </BorderBox>
                                </Col>
                            ))}
                        </Row>
                    </BillingHistory>
                </Col>
            </Row>
            {contextHolder}
        </>
    )
}
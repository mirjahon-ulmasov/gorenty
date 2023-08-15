/* eslint-disable no-constant-condition */
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, DatePickerProps, Row, Space, Typography } from 'antd'
import clsx from 'clsx'
import { 
    CustomBreadcrumb, CustomDatePicker, Payment, 
    BillingHistory, BorderBox, IDTag, Label, 
    StyledTextL1, StyledTextL2, SmallImg  
} from 'components/input'
import { BucketFile, TBranch, TPosition } from 'types/api'
import { useFetchStaffQuery } from 'services'
import { formatPhone } from 'utils/index'

const { Title } = Typography

export default function StaffDetail() {
    const navigate = useNavigate()
    const { staffID } = useParams()
    const [isOpenPayment, setIsOpenPayment] = useState(false);

    const { data: staff } = useFetchStaffQuery(staffID as string)

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Ishchilar', link: '/staff/list' },
                    { title: staff?.full_name ?? '-' },
                ]}
            />
            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Space size="large">
                                <IDTag>{staff?.object_index}</IDTag>
                                <Title level={3}>{staff?.full_name ?? '-'}</Title>
                                <Button
                                    size="large"
                                    onClick={() =>
                                        navigate(
                                            '/staff/'.concat(
                                                staffID?.toString() as string,
                                                '/edit'
                                            )
                                        )
                                    }
                                >
                                    O’zgartirish
                                </Button>
                            </Space>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[12, 12]}>
                                <Col span={24}>
                                    <Label>Ishchi ma’lumotlari</Label>
                                </Col>
                                <Col span={24}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Adrress</StyledTextL1>
                                        <StyledTextL2>{staff?.address ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Telefon raqami</StyledTextL1>
                                        <StyledTextL2>
                                            {formatPhone(staff?.phone_number ?? '-')}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Qo’shilgan filial</StyledTextL1>
                                        <StyledTextL2>
                                            {(staff?.branch as TBranch)?.title ?? '-'}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Lavozimi</StyledTextL1>
                                        <StyledTextL2>
                                            {(staff?.position as TPosition)?.title ?? '-'}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Passport</StyledTextL1>
                                        <StyledTextL2>{staff?.passport_number ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={24}>
                                    <BorderBox className='fd-col' p='24px' bg='rgba(27, 16, 5, 0.02)'>
                                        <StyledTextL2 fs={18}>Qo’shimcha ma’lumot</StyledTextL2>
                                        <StyledTextL1 fs={16}>{staff?.additional_information ?? '-'}</StyledTextL1>
                                    </BorderBox>
                                </Col>
                                {(staff?.staff_images && staff.staff_images.length > 0) && (
                                    <Col span={24}>
                                        <BorderBox className='d-flex jc-start fw-wrap gap-12'>
                                            {(staff.staff_images as BucketFile[])?.map((file) => (
                                                <SmallImg 
                                                    width={90} 
                                                    height={90} 
                                                    key={file.id} 
                                                    src={file.image.file} 
                                                    alt='Staff' 
                                                />
                                            ))}
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
                                    <Col>
                                        <Title level={5}>Hisob-kitob tarixi</Title>
                                    </Col>
                                    <Col>
                                        <Space size='small'>
                                            <Button size='middle' onClick={() => setIsOpenPayment(true)}>
                                                Hisob-kitob qo’shish
                                            </Button>
                                            <CustomDatePicker 
                                                size='middle' 
                                                placeholder='Sanani tanlang'
                                                onChange={onChange} 
                                            />
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
        </>
    )
}


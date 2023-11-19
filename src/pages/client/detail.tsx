import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { 
    Button, Col, DatePickerProps, 
    Row, Space, Typography
} from 'antd'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { 
    CustomBreadcrumb, CustomDatePicker, Payment, 
    Status, BillingHistory, BorderBox, IDTag, 
    Label, StyledLink, StyledTextL1, StyledTextL2  
} from 'components/input'
import { formatPhone, getStatus } from 'utils/index'
import { CLIENT_STATUS, ID, TRANSACTION } from 'types/index'
import { useCustomerIncomeMutation, useCustomerOutcomeMutation, useFetchClientQuery } from 'services'
import { TBranch } from 'types/api'

const { Title } = Typography

export default function ClientDetail() {
    const navigate = useNavigate()
    const { clientID } = useParams()

    const [transactionType, setTransactionType] = useState<TRANSACTION>();
    const { data: client } = useFetchClientQuery(clientID as string)
    const [customerIncome] = useCustomerIncomeMutation()
    const [customerOutcome] = useCustomerOutcomeMutation()

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
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
                                            <Button size="middle" onClick={() => setTransactionType(TRANSACTION.INCOME)}>
                                                Balansni to’ldirish
                                            </Button>
                                            <Button size="middle" onClick={() => setTransactionType(TRANSACTION.OUTCOME)}>
                                                Balansni yechish
                                            </Button>
                                        </Space>
                                    </BorderBox>
                                </Col>
                                {transactionType && (
                                    <Col span={24}>
                                        <Payment
                                            btnText={transactionType === TRANSACTION.INCOME ? 'To’ldirish' : 'Yechish'}
                                            onClose={() => setTransactionType(undefined)} 
                                            onSubmit={(data) => {
                                                if(transactionType === TRANSACTION.INCOME) {
                                                    customerIncome({ ...data, customer: clientID as ID }).unwrap()
                                                        .then(() => {
                                                            setTransactionType(undefined)
                                                            toast.success("Баланс пополнен")
                                                        })
                                                        .catch(() => toast.error("Что-то пошло не так"))
                                                } else {
                                                    customerOutcome({ ...data, customer: clientID as ID }).unwrap()
                                                        .then(() => {
                                                            setTransactionType(undefined)
                                                            toast.success("Списано с баланса")
                                                        })
                                                        .catch(() => toast.error("Что-то пошло не так"))
                                                }
                                            }}
                                        />
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
                                    <StyledLink to='/order/list' state={{ customer: clientID }} className='ml-1'>
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
                                            <Button size='middle'>
                                                Harajat qo’shish
                                            </Button>
                                            <CustomDatePicker placeholder='Sana' size='middle' onChange={onChange} />
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
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


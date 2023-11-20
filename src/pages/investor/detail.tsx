
import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, DatePickerProps, Row, Space, Typography } from 'antd'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useAppSelector } from 'hooks/redux'
import { 
    useFetchInvestorQuery, useInvestorIncomeMutation, 
    useInvestorOutcomeMutation 
} from 'services'
import { 
    CustomBreadcrumb, CustomDatePicker, Payment, 
    BillingHistory, BorderBox, IDTag, 
    Label, StyledLink, StyledTextL1, StyledTextL2, SmallImg  
} from 'components/input'
import { TBranch, BucketFile } from 'types/api'
import { PaymentLog } from 'types/branch-payment'
import { formatPhone } from 'utils/index'
import { ID, ROLE, TRANSACTION } from 'types/index'

const { Title } = Typography

export default function InvestorDetail() {
    const navigate = useNavigate()
    const { investorID } = useParams()

    const [transactionType, setTransactionType] = useState<TRANSACTION>();
    const { data: investor } = useFetchInvestorQuery(investorID as string)
    const { user } = useAppSelector(state => state.auth)

    const [investorIncome] = useInvestorIncomeMutation()
    const [investorOutcome] = useInvestorOutcomeMutation()

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const makeTransaction = useCallback((data: PaymentLog.DTOUpload) => {
        if(transactionType === TRANSACTION.INCOME) {
            investorIncome({ ...data, investor: investorID as ID }).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Баланс пополнен")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        } else {
            investorOutcome({ ...data, investor: investorID as ID }).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Списано с баланса")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        }
    }, [investorID, investorIncome, investorOutcome, transactionType])


    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Investorlar', link: '/investor/list' },
                    { title: investor?.full_name ?? '-' },
                ]}
            />
            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div className='d-flex jc-sb gap-8 fw-wrap'>
                                <IDTag>{investor?.object_index}</IDTag>
                                <Title level={3}>{investor?.full_name ?? '-'}</Title>
                                {user?.state === ROLE.ADMIN && (
                                    <Space size="small">
                                        <Button
                                            size="large"
                                            onClick={() =>
                                                navigate(
                                                    '/investor/'.concat(
                                                        investorID?.toString() as string,
                                                        '/edit'
                                                    )
                                                )
                                            }
                                        >
                                            O’zgartirish
                                        </Button>
                                    </Space>
                                )}
                            </div>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[12, 12]}>
                                <Col span={24}>
                                    <Label>Investorning joriy balansi</Label>
                                </Col>
                                <Col span={24}>
                                    <BorderBox p='20px 12px'>
                                        <Title level={3}>{investor?.balance?.toLocaleString()} so’m</Title>
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
                                            onSubmit={(data) => makeTransaction(data)}
                                        />
                                    </Col>
                                )}
                                <Col span={24}>
                                    <Label>Investor ma’lumotlari</Label>
                                </Col>
                                <Col span={24}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Adrress</StyledTextL1>
                                        <StyledTextL2>{investor?.address ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Telefon raqami</StyledTextL1>
                                        <StyledTextL2>{formatPhone(investor?.phone_number ?? '-')}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Qo’shilgan filial</StyledTextL1>
                                        <StyledTextL2>{(investor?.branch as TBranch)?.title ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                {(investor?.investor_images && investor.investor_images.length > 0) && (
                                    <Col span={24}>
                                        <BorderBox>
                                            <div className='d-flex jc-start fw-wrap gap-12'>
                                                {(investor?.investor_images as BucketFile[])
                                                .map((file) => (
                                                    <SmallImg 
                                                        width={90} 
                                                        height={90} 
                                                        key={file.id} 
                                                        src={file.image.file} 
                                                        alt='Investor'
                                                    />
                                                ))}
                                            </div>
                                        </BorderBox>
                                    </Col>
                                )}
                                <Col span={24}>
                                    <StyledLink to='/order/list' state={{ investor: investorID }} className='ml-1'>
                                        Investorga tegishli buyurtmalar {investor?.orders_count}
                                    </StyledLink>
                                </Col>
                                <Col span={24} className='mt-1'>
                                    <Label className='d-flex jc-sb'>
                                        Investor statistikasi
                                        <Button type='primary' size='middle' onClick={() => navigate(`/investor/${investorID}/statistics`)}>
                                            To’liq hisobotni ko’rish
                                        </Button>
                                    </Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Investorning Mart, 2023yil foydasi</StyledTextL1>
                                        <StyledTextL2>67 000 000 so’m</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Investor Gorentyga keltirgan foydasi</StyledTextL1>
                                        <StyledTextL2>17 000 000 so’m</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={24}>
                                    <StyledLink to='/car/list' className='ml-1' state={{ investor: investorID }}>
                                        Investorga tegishli avtomobillar {investor?.vehicles_count}
                                    </StyledLink>
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


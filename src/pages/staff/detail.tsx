
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, DatePickerProps, Row, Space, Typography } from 'antd'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import moment from 'moment'
import { 
    CustomBreadcrumb, CustomDatePicker, Payment, 
    BillingHistory, BorderBox, IDTag, Label, 
    StyledTextL1, StyledTextL2, SmallImg, LogList  
} from 'components/input'
import { 
    useFetchStaffQuery, useStaffIncomeMutation, 
    useStaffOutcomeMutation, useFetchPaymentLogsQuery
} from 'services'
import { BucketFile, TBranch, TPosition } from 'types/api'
import { PaymentLog } from 'types/branch-payment'
import { formatPhone, getStatus } from 'utils/index'
import { ID, TRANSACTION } from 'types/index'

const { Title } = Typography

export default function StaffDetail() {
    const navigate = useNavigate()
    const { staffID } = useParams()
    const [transactionType, setTransactionType] = useState<TRANSACTION>();

    const { data: staff } = useFetchStaffQuery(staffID as string)
    const { data: paymentLogs } = useFetchPaymentLogsQuery({
        staff: staffID
    })

    const [staffIncome] = useStaffIncomeMutation()
    const [staffOutcome] = useStaffOutcomeMutation()

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
    
    const makeTransaction = useCallback((data: PaymentLog.DTOUpload) => {
        if(transactionType === TRANSACTION.INCOME) {
            staffIncome({ ...data, staff: staffID as ID }).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Баланс пополнен")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        } else {
            staffOutcome({ ...data, staff: staffID as ID }).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Списано с баланса")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        }
    }, [staffID, staffIncome, staffOutcome, transactionType])

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Ishchilar', link: '/admin/staff/list' },
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
                                            '/admin/staff/'.concat(
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
                                    <Label>Mijozning joriy balansi</Label>
                                </Col>
                                <Col span={24}>
                                    <BorderBox p='20px 12px'>
                                        <Title level={3}>{staff?.balance?.toLocaleString()} so’m</Title>
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
                                <div className='d-flex jc-sb gap-8 fw-wrap'>
                                    <Title level={5}>Hisob-kitob tarixi</Title>
                                    <CustomDatePicker 
                                        placeholder='Sana' 
                                        size='middle' 
                                        onChange={onChange} 
                                    />
                                </div>
                            </Col>
                            <LogList>
                                {paymentLogs?.results?.map(log => (
                                    <BorderBox key={log.id} className={clsx(
                                        'bill', 
                                        log.payment_type === TRANSACTION.INCOME ? 'income' : 'outgoings'
                                    )}>
                                        <div className='d-flex jc-sb w-100'>
                                            <div className='d-flex ai-start fd-col gap-4'>
                                                <StyledTextL2>
                                                    {getStatus(log.payment_category, 'payment_category')}
                                                </StyledTextL2>
                                                <StyledTextL1>
                                                    {`${log.branch?.title}: ${log.payment?.title}`}
                                                </StyledTextL1>
                                            </div>
                                            <div className='d-flex ai-end fd-col gap-4'>
                                                <StyledTextL2>
                                                    {log.payment_type === TRANSACTION.INCOME ? "+" : "-"}
                                                    {log.total.toLocaleString()} so’m
                                                </StyledTextL2>
                                                <StyledTextL1>{moment(log.created_at).format('LL')}</StyledTextL1>
                                            </div>
                                        </div>
                                    </BorderBox>
                                ))}
                            </LogList>
                        </Row>
                    </BillingHistory>
                </Col>
            </Row>
        </>
    )
}


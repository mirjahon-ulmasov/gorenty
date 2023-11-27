import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
    Button, Col, DatePickerProps, 
    Divider, 
    Row, Space, Typography
} from 'antd'
import toast from 'react-hot-toast'
import moment from 'moment'
import { 
    CustomBreadcrumb, CustomDatePicker, Payment, 
    Status, BillingHistory, BorderBox, IDTag, 
    Label, StyledLink, StyledTextL1, StyledTextL2, LogList, ButtonIcon, ArrowDown  
} from 'components/input'
import { formatPhone, getStatus } from 'utils/index'
import { 
    useBranchOrderCustomerDebtOutcomeMutation, useCustomerIncomeMutation, 
    useCustomerOrderDebtIncomeMutation, useCustomerOutcomeMutation, 
    useFetchClientQuery, useFetchCustomerPaymentLogsQuery 
} from 'services'
import { CLIENT_STATUS, ID, PAYMENT_TYPE } from 'types/index'
import { PaymentLog } from 'types/branch-payment'
import { TBranch } from 'types/api'

const { Title } = Typography

export default function ClientDetail() {
    const navigate = useNavigate()
    const { clientID } = useParams()
    const [transactionType, setTransactionType] = useState<PAYMENT_TYPE>();
    const [logs, setLogs] = useState<PaymentLog.LogType[]>([]);

    const { data: client } = useFetchClientQuery(clientID as string)
    const { data: paymentLogs } = useFetchCustomerPaymentLogsQuery(clientID as ID)

    const [customerIncome] = useCustomerIncomeMutation()
    const [customerOutcome] = useCustomerOutcomeMutation()
    const [customerOrderDebtIncome] = useCustomerOrderDebtIncomeMutation()
    const [branchOrderDebtOutcome] = useBranchOrderCustomerDebtOutcomeMutation()

    useEffect(() => {
        setLogs(paymentLogs?.results?.map(log => ({
            ...log,
            open_payment: false,
            open_logs: false
        })) || []);
    }, [paymentLogs]);

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    // ---------------- Expenses ----------------

    const changeLog = useCallback((id: ID, key: keyof PaymentLog.LogType, value: unknown) => {
        setLogs(prev => prev.map(log => {
            if(log.id === id) {
                return {
                    ...log,
                    [key]: value
                }
            }
            return log
        }))
    }, [])

    const makeTransaction = useCallback((data: PaymentLog.DTOUpload) => {
        if(transactionType === PAYMENT_TYPE.INCOME) {
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
    }, [clientID, customerIncome, customerOutcome, transactionType])

    const closeExpense = useCallback((data: PaymentLog.DTOUpload, log: PaymentLog.LogType) => {
        if(log.is_applies_to_customer) {
            customerOrderDebtIncome({ ...data, order: log.order, debt: log.id }).unwrap()
                .then(() => {
                    changeLog(log.id, 'open_payment', false)
                    toast.success("Harajat yopildi")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        } else if(log.is_applies_to_branch) {
            branchOrderDebtOutcome({ ...data, order: log.order, debt: log.id }).unwrap()
                .then(() => {
                    changeLog(log.id, 'open_payment', false)
                    toast.success("Harajat yopildi")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        }

    }, [branchOrderDebtOutcome, customerOrderDebtIncome, changeLog])
    
    function getButtonStyle(open: boolean): React.CSSProperties  {
        return {
            display: 'flex', 
            transition: 'ease-in 0.2s',
            rotate: `${open ? '180deg' : '0deg'}`,
        }
    }


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
                                    <BorderBox p='20px 12px' gap='12px'>
                                        <Title level={3}>
                                            {client?.balance?.toLocaleString()} so’m
                                        </Title>
                                        <Space>
                                            <Button size="middle" onClick={() => setTransactionType(PAYMENT_TYPE.INCOME)}>
                                                Balansni to’ldirish
                                            </Button>
                                            <Button size="middle" onClick={() => setTransactionType(PAYMENT_TYPE.OUTCOME)}>
                                                Balansni yechish
                                            </Button>
                                        </Space>
                                    </BorderBox>
                                </Col>
                                {transactionType && (
                                    <Col span={24}>
                                        <Payment
                                            btnText={transactionType === PAYMENT_TYPE.INCOME ? 'To’ldirish' : 'Yechish'}
                                            onClose={() => setTransactionType(undefined)} 
                                            onSubmit={(data) => makeTransaction(data)}
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
                                <div className='d-flex jc-sb gap-8 fw-wrap'>
                                    <Title level={5}>Hisob-kitob tarixi</Title>
                                    <CustomDatePicker 
                                        placeholder='Sana' 
                                        size='middle' 
                                        onChange={onChange} 
                                    />
                                </div>
                            </Col>
                            <LogList mh={60}>
                                {logs.map(log => (
                                    <BorderBox key={log.id} className="bill">
                                        <div className='d-flex fd-col gap-4 w-100'>
                                            <div className='d-flex jc-sb w-100'>
                                                <Status type={(log.is_paid || log.is_paid_immediately) ? 'success' : 'danger'}>
                                                    {(log.is_paid || log.is_paid_immediately) ? 'To’langan': 'Qarz'}
                                                </Status>
                                                <Space>
                                                    <Status type='client' value={CLIENT_STATUS.NEW}>
                                                        {log.is_applies_to_branch && 'Filial'}
                                                        {log.is_applies_to_customer && 'Mijoz'}
                                                    </Status>
                                                    {!!log.branch_payment_logs?.length && (
                                                        <ButtonIcon onClick={() => changeLog(log.id, 'open_logs', !log.open_logs)}>
                                                            <span style={getButtonStyle(log.open_logs)}>
                                                                <ArrowDown />
                                                            </span>
                                                        </ButtonIcon>
                                                    )}
                                                </Space>
                                            </div>
                                            <div className='d-flex jc-sb w-100'>
                                                <StyledTextL2>
                                                    {getStatus(log.payment_category, 'payment_category')}
                                                </StyledTextL2>
                                                <StyledTextL2 fs={18}>{log.total.toLocaleString()} so’m</StyledTextL2>
                                            </div>
                                            <div className='d-flex jc-sb w-100'>
                                                <StyledLink fs={14} fw={500} to={`/admin/branch/${log.branch?.id}/detail`}>
                                                    {log.branch?.title}
                                                </StyledLink>
                                                <StyledTextL1>
                                                    {moment(log.created_at).format('LL')}
                                                </StyledTextL1>
                                            </div>
                                            {(log.is_debt && !log.is_paid) && (
                                                <div className='d-flex jc-sb mt-05 w-100'>
                                                    <Button type='primary' onClick={() => changeLog(log.id, 'open_payment', true)}>
                                                        To’lash
                                                    </Button>
                                                    <StyledTextL2 color='#ff4d4f'>
                                                        Qoldiq: {log.remain?.toLocaleString()} so’m
                                                    </StyledTextL2>
                                                </div>
                                            )}
                                            {log.open_logs && (
                                                <div className='d-flex fd-col gap-8 w-100'>
                                                    <Divider style={{ background: '#FFBD99', margin: '8px 0' }} />
                                                    {log.branch_payment_logs.map(el => (
                                                        <div key={el.id} className='d-flex fd-col w-100'>
                                                            <div className='d-flex jc-sb w-100'>
                                                                <StyledTextL1>{el.branch?.title}</StyledTextL1>
                                                                <StyledTextL2 fs={16}>{el.total.toLocaleString()} so’m</StyledTextL2>
                                                            </div>
                                                            <div className='d-flex jc-sb w-100'>
                                                                <StyledTextL1>{el.payment?.title}</StyledTextL1>
                                                                <StyledTextL1>
                                                                    {moment(el.created_at).format('LL')}
                                                                </StyledTextL1>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {log.open_payment && (
                                                <div className='mt-05 w-100'>
                                                    <Payment
                                                        log={log}
                                                        btnText="Harajat to’lash"
                                                        onClose={() => changeLog(log.id, 'open_payment', false)}
                                                        onSubmit={(data) => closeExpense(data, log)}
                                                    />
                                                </div>
                                            )}
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


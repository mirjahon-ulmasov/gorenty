
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, DatePickerProps, Divider, Pagination, PaginationProps, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import moment from 'moment'
import { 
    CustomBreadcrumb, CustomDatePicker, Payment, 
    BillingHistory, BorderBox, IDTag, Label, 
    StyledTextL1, StyledTextL2, SmallImg, LogList, Status, ButtonIcon, StyledLink, ArrowDown  
} from 'components/input'
import { 
    useFetchStaffQuery, useStaffIncomeMutation, 
    useStaffOutcomeMutation, useFetchStaffPaymentLogsQuery
} from 'services'
import { BucketFile, TBranch, TPosition, Pagination as IPagination } from 'types/api'
import { PaymentLog } from 'types/branch-payment'
import { formatPhone, getStatus } from 'utils/index'
import { CLIENT_STATUS, ID, PAYMENT_TYPE } from 'types/index'

const { Title } = Typography

export default function StaffDetail() {
    const navigate = useNavigate()
    const { staffID } = useParams()
    const [transactionType, setTransactionType] = useState<PAYMENT_TYPE>();
    const [logs, setLogs] = useState<PaymentLog.LogType[]>([]);
    const [pagination, setPagination] = useState<IPagination>({
        page: 1,
        page_size: 5
    });

    const { data: staff } = useFetchStaffQuery(staffID as string)
    const { data: paymentLogs } = useFetchStaffPaymentLogsQuery({
        params: { ...pagination },
        id: staffID as ID
    })

    const [staffIncome] = useStaffIncomeMutation()
    const [staffOutcome] = useStaffOutcomeMutation()

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

    
    function getButtonStyle(open: boolean): React.CSSProperties  {
        return {
            display: 'flex', 
            transition: 'ease-in 0.2s',
            rotate: `${open ? '180deg' : '0deg'}`,
        }
    }

    const changePagination: PaginationProps['onChange'] = (page, page_size) => {
        setPagination({ page, page_size });
    };

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
                            <LogList mh={40}>
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
                                                        {log.is_applies_to_staff && 'Ishchi'}
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
                                                <Space>
                                                    <StyledLink fs={14} fw={500} to={`/admin/branch/${log.branch?.id}/detail`}>
                                                        {log.branch?.title}
                                                    </StyledLink>
                                                    {!log.is_debt && (
                                                        <StyledTextL1>{log.payment?.title}</StyledTextL1>
                                                    )}
                                                </Space>
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
                                        </div>
                                    </BorderBox>
                                ))}
                            </LogList>
                            {!!logs.length && (
                                <Pagination
                                    current={pagination.page}
                                    pageSize={pagination.page_size}
                                    onChange={changePagination} 
                                    total={paymentLogs?.count} 
                                />
                            )}
                        </Row>
                    </BillingHistory>
                </Col>
            </Row>
        </>
    )
}


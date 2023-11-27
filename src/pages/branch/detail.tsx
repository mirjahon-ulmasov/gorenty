import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { 
    Button, Col, Divider, Pagination, PaginationProps, Row, Space, Typography, 
} from 'antd'
import toast from 'react-hot-toast';
import moment from 'moment';
import { 
    CustomBreadcrumb, Label, StyledTextL1, 
    StyledTextL2, BorderBox, SmallImg,
    MinusIcon, PlusIcon, BranchPayment, LogList, 
    Payment, Status, ButtonIcon, ArrowDown, StyledLink
} from 'components/input'
import {
    useBranchIncomeMutation, useBranchOutcomeMutation, 
    useFetchBranchQuery, useFetchBranchPaymentLogsQuery,
    useBranchOrderCustomerDebtOutcomeMutation,
    useFetchBranchPaymentsQuery
} from 'services';
import { PaymentLog } from 'types/branch-payment';
import { CLIENT_STATUS, ID, PAYMENT_TYPE } from 'types/index';
import { formatPhone, getStatus } from 'utils/index';
import { BucketFile, Pagination as IPagination } from 'types/api'

const { Title } = Typography

export default function CarDetail() {
    const navigate = useNavigate()
    const { branchID } = useParams()
    const [transactionType, setTransactionType] = useState<PAYMENT_TYPE>();
    const [logs, setLogs] = useState<PaymentLog.LogType[]>([]);
    const [pagination, setPagination] = useState<IPagination>({
        page: 1,
        page_size: 5
    });

    const { data: branchPayments } = useFetchBranchPaymentsQuery({});
    const { data: branch } = useFetchBranchQuery(branchID as string)
    const { data: paymentLogs } = useFetchBranchPaymentLogsQuery({
        params: { ...pagination },
        id: branchID as ID
    })

    const [branchIncome] = useBranchIncomeMutation()
    const [branchOutcome] = useBranchOutcomeMutation()
    const [branchOrderDebtOutcome] = useBranchOrderCustomerDebtOutcomeMutation()

    useEffect(() => {
        setLogs(paymentLogs?.results?.map(log => ({
            ...log,
            open_payment: false,
            open_logs: false
        })) || []);
    }, [paymentLogs]);

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
    
    const makeTransaction = useCallback((data: PaymentLog.Branch) => {
        if(transactionType === PAYMENT_TYPE.INCOME) {
            branchIncome(data).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Баланс пополнен")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        } else {
            branchOutcome(data).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Списано с баланса")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        }
    }, [branchIncome, branchOutcome, transactionType])    

    const closeExpense = useCallback((data: PaymentLog.DTOUpload, log: PaymentLog.LogType) => {
        if(log.is_applies_to_branch) {
            branchOrderDebtOutcome({ ...data, order: log.order, debt: log.id }).unwrap()
                .then(() => {
                    changeLog(log.id, 'open_payment', false)
                    toast.success("Harajat yopildi")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        }
    }, [branchOrderDebtOutcome, changeLog])

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

    const foundBranch = useCallback((id: ID) => {
        return branchPayments?.find(el => el.id === id)
    }, [branchPayments])

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Filiallar', link: '/admin/branch/list' },
                    { title: branch?.title ?? '-' },
                ]}
            />
            <Row gutter={[48, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div className='d-flex jc-sb gap-12 fw-wrap'>  
                                <Title level={3}>{branch?.title ?? '-'}</Title>
                                <Space size="small">
                                    <Button
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/admin/branch/'.concat(
                                                    branchID?.toString() as string,
                                                    '/payment'
                                                )
                                            )
                                        }
                                    >
                                        Hisoblar
                                    </Button>
                                    <Button
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/admin/branch/'.concat(
                                                    branchID?.toString() as string,
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
                                    <Label>Filialdagi kassa</Label>
                                </Col>
                                <BorderBox p='20px 12px' gap='12px' className='w-100'>
                                    <Title level={2}>{branch?.total?.toLocaleString()} so’m</Title>
                                    <Space>
                                        <Button 
                                            size="middle" 
                                            className="d-flex"
                                            icon={<PlusIcon />}
                                            onClick={() => setTransactionType(PAYMENT_TYPE.INCOME)} 
                                        >
                                            Kirim qilish
                                        </Button>
                                        <Button 
                                            size="middle" 
                                            className="d-flex"
                                            icon={<MinusIcon />}
                                            onClick={() => setTransactionType(PAYMENT_TYPE.OUTCOME)}
                                        >
                                            Chiqim qilish
                                        </Button>
                                    </Space>
                                </BorderBox>
                                {transactionType && (
                                    <Col span={24}>
                                        <BranchPayment
                                            branch={branch?.id as ID}
                                            onClose={() => setTransactionType(undefined)} 
                                            onSubmit={(data) => makeTransaction(data)}
                                            btnText={transactionType === PAYMENT_TYPE.INCOME ? 'Kirim' : 'Chiqim'}
                                        />
                                    </Col>
                                )}
                                <LogList mh={30}>
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
                                                            {log.is_applies_to_investor && 'Investor'}
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
                                                    {!!log.order && (
                                                        <StyledLink fs={14} fw={500} to={`/order/${log.order}/detail`}>
                                                            Buyurtma
                                                        </StyledLink>
                                                    )}
                                                    {!!log.vehicle && (
                                                        <StyledLink fs={14} fw={500} to={`/car/${log.vehicle}/detail`}>
                                                            Avtomobil
                                                        </StyledLink>
                                                    )}
                                                    {!!log.branch_payment && (
                                                        <StyledLink fs={14} fw={500} 
                                                            to={`/admin/branch/${foundBranch(log.branch_payment)?.branch.id}/detail`}
                                                        >
                                                            {foundBranch(log.branch_payment)?.branch.title}
                                                        </StyledLink>
                                                    )}
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
                                {!!logs.length && (
                                    <Pagination
                                        current={pagination.page}
                                        pageSize={pagination.page_size}
                                        onChange={changePagination} 
                                        total={paymentLogs?.count} 
                                    />
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            <Label>Filial ma’lumotlari</Label>
                        </Col>
                        <Col span={24}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Telefon</StyledTextL1>
                                <StyledTextL2>{formatPhone(branch?.phone_number ?? '-')}</StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={24}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Manzil</StyledTextL1>
                                <StyledTextL2>{branch?.address ?? '-'}</StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={12}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Ma’sul shaxs</StyledTextL1>
                                <StyledTextL2>{branch?.attached_person_full_name ?? '-'}</StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={12}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Telefon raqami</StyledTextL1>
                                <StyledTextL2>
                                    {formatPhone(branch?.attached_person_phone_number ?? '-')}
                                </StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={24}>
                            <BorderBox className='fd-col' p='24px' bg='rgba(27, 16, 5, 0.02)'>
                                <StyledTextL2 fs={18}>Qo’shimcha ma’lumot</StyledTextL2>
                                <StyledTextL1 fs={16}>{branch?.description ?? '-'}</StyledTextL1>
                            </BorderBox>
                        </Col>
                        {(branch?.branch_images && branch.branch_images.length > 0) && (
                            <Col span={24}>
                                <BorderBox className='d-flex jc-start fw-wrap gap-12'>
                                    {(branch.branch_images as BucketFile[])?.map((el) => (
                                        <SmallImg 
                                            width={90} 
                                            height={90} 
                                            key={el.id} 
                                            src={el.image.file} 
                                            alt='Branch' 
                                        />
                                    ))}
                                </BorderBox>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    )
}
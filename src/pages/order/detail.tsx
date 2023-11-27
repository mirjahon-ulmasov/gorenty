
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import moment from 'moment'
import { styled } from 'styled-components'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast';
import axios from 'axios';
import { v4 as uuid } from 'uuid'
import { 
    Button, Col, DatePickerProps, 
    Row, Space, Typography, Divider, 
    Modal, Form, InputNumber,
    UploadFile
} from 'antd'
import { UploadChangeParam } from 'antd/es/upload';
import { useAppSelector } from 'hooks/redux';
import { 
    CustomBreadcrumb, Payment, Status, Label, 
    StyledTextL1, StyledTextL2, OrderCard, 
    BorderBox, CustomDatePicker, CustomUpload,  
    LogList, ArrowDown, ButtonIcon,
    StyledLink, DocumentIcon, PlusIcon
} from 'components/input'
import { 
    useActivateOrderMutation, useAddOrderImageMutation, 
    useCancelOrderMutation, useDeleteOrderImageMutation, 
    useFetchOrderQuery, useFinishOrderMutation, 
    useOrderIncomeMutation, useFetchOrderPaymentLogsQuery,
    useCustomerOrderDebtIncomeMutation,
    useBranchOrderCustomerDebtOutcomeMutation
} from 'services';
import { CLIENT_STATUS, ID, ORDER_STATUS, ROLE } from 'types/index'
import { disabledDate, formatPlate, getStatus } from 'utils/index'
import { Account, BucketFile, Car, CarBrand, Client, TBranch } from 'types/api';
import { PaymentLog } from 'types/branch-payment';

const { Title } = Typography

export default function OrderDetail() {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const { orderID } = useParams()
    const [isOpenPayment, setIsOpenPayment] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [extendDate, setExtendDate] = useState<Dayjs | null>(null)
    const [dateModal, setDateModal] = useState(false)
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
    const [logs, setLogs] = useState<PaymentLog.LogType[]>([]);

    const { user } = useAppSelector(state => state.auth)
    const { data: order, isError } = useFetchOrderQuery(orderID as string)
    const { data: paymentLogs } = useFetchOrderPaymentLogsQuery(orderID as ID)

    const [activateOrder] = useActivateOrderMutation()
    const [cancelOrder] = useCancelOrderMutation()
    const [finishOrder] = useFinishOrderMutation()

    const [addOrderImage] = useAddOrderImageMutation()
    const [deleteOrderImage] = useDeleteOrderImageMutation()

    const [orderIncome] = useOrderIncomeMutation()
    const [customerOrderDebtIncome] = useCustomerOrderDebtIncomeMutation()
    const [branchOrderCustomerDebtOutcome] = useBranchOrderCustomerDebtOutcomeMutation()

    useEffect(() => {
        if(isError) return;

        if(order?.order_images) {
            setImageFiles((order?.order_images as BucketFile[]).map(file => ({
                uid: uuid(),
                response: file,
                status: 'done',
                name: 'image.png',
                url: file.image.file
            })))
        }
    }, [order, isError])

    useEffect(() => {
        setLogs(paymentLogs?.results?.map(log => ({
            ...log,
            open_payment: false,
            open_logs: false
        })) || []);
    }, [paymentLogs]);


    // ------------- Expenses -------------

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

    const addExpense = useCallback((data: PaymentLog.DTOUpload) => {
        orderIncome({ ...data, order: order?.id as ID }).unwrap()
            .then(() => {
                setIsOpenPayment(false)
                toast.success("Harajat qo’shildi")
            })
            .catch(() => toast.error("Что-то пошло не так"))
    }, [order?.id, orderIncome])

    const closeExpense = useCallback((data: PaymentLog.DTOUpload, log: PaymentLog.LogType) => {
        if(log.is_applies_to_customer) {
            customerOrderDebtIncome({ ...data, order: log.order, debt: log.id }).unwrap()
                .then(() => {
                    changeLog(log.id, 'open_payment', false)
                    toast.success("Harajat yopildi")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        } else if(log.is_applies_to_branch) {
            branchOrderCustomerDebtOutcome({ ...data, order: log.order, debt: log.id }).unwrap()
                .then(() => {
                    changeLog(log.id, 'open_payment', false)
                    toast.success("Harajat yopildi")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        }

    }, [branchOrderCustomerDebtOutcome, changeLog, customerOrderDebtIncome])

    function getButtonStyle(open: boolean): React.CSSProperties  {
        return {
            display: 'flex', 
            rotate: `${open ? '180deg' : '0deg'}`,
            transition: 'ease-in 0.2s'
        }
    }    

    // ------------- Image Upload -------------

    function changeImage(data: UploadChangeParam<UploadFile<any>>) {
        setImageFiles(data.fileList)

        if(data.file.status !== 'done') return;

        addOrderImage({ 
            order: parseInt(orderID as string, 10), 
            image: data.file.response.id 
        })
            .unwrap()
            .then((response) => {
                setImageFiles(prev => prev.map(file => {
                    if(file.response.id === response.image) {
                        return {
                            ...file,
                            response
                        }
                    }
                    return file
                }))                                        
            })
            .catch(() => toast.error('Rasm yuklanmadi'))
    }

    function removeImage(data: UploadFile<any>) {
        if(user?.state !== ROLE.ADMIN) {
            toast.error("У вас нет разрешения на удаление")
            return false;
        }

        if(!data.response.id) return true
                                
        return deleteOrderImage({ id: data.response.id })
            .unwrap()
            .then(() => {
                toast.success('Rasm muvafaqiyatli o’chirildi');
                return true;
            }).catch(() => {
                toast.error('Rasm o’chirilmadi');
                return false;
            })
    }

    // --------------------------
    
    const orderCar = useMemo(() => {
        return order?.vehicle as Car.DTO | undefined;
    }, [order])

    const orderCustomer = useMemo(() => {
        return order?.customer as Client.DTO | undefined;
    }, [order])

    // ---------------- Dates ----------------
    const daysDifference = useMemo(() => {  
        if(order?.start_date && order?.end_date) {
            return dayjs(order?.end_date).diff(dayjs(order?.start_date), 'day');
        }
        return 0; 
    }, [order])

    function hideDateModal() {
        setDateModal(false)
    }

    const extendDateHandler: DatePickerProps['onChange'] = (date) => {
        setExtendDate(date as Dayjs);
    };

    function confirmExtendDate() {
        console.log(extendDate);
        hideDateModal()
    }

    function viewDocument(file: string) {
        window.open(file, '_blank');
    }

    const downloadDocument = async (file: string) => {
        const splittedFile = file.split('/')
        const name = splittedFile[splittedFile.length - 1]
        
        try {
            const response = await axios.get(file, {
                responseType: 'blob',
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };
    

    // -------------------------------

    const confirm = (action: 'activate' | 'finish' | 'cancel') => {
        modal.confirm({
            title: action === 'activate' 
            ? 'Хотите активировать заказ?' 
            : action === 'finish' 
            ? 'Хотите закрыть заказ?' 
            : 'Хотите отменить заказ?',
            icon: <ExclamationCircleOutlined />,
            content: (
                action !== 'cancel' && (
                    <Form form={form}>
                        <Form.Item
                            name="mileage"
                            label="Avtomobilni yurgan kilometrini kiriting"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <InputNumber size="large" placeholder="100000" style={{ width: '100%' }}/>
                        </Form.Item>
                    </Form>
                )
            ),
            okText: 'Подтвердить',
            cancelText: 'Отменить',
            onOk() {
                const mileage = form.getFieldValue('mileage');
                if(action !== 'cancel' && mileage < ((order?.vehicle as Car.DTO)?.mileage as number)) {
                    toast.error("Пожалуйста, введите действительный пробег")
                    return;
                }
                
                switch(action) {
                    case 'activate': {
                        activateOrder({ id: order?.id as number, mileage })
                        return;
                    }
                    case 'finish' : {
                        finishOrder({ id: order?.id as number, mileage })
                        return;
                    }
                    case 'cancel': {
                        cancelOrder(order?.id as number)
                        return;
                    }
                }
            },
            onCancel() {
                form.setFieldValue('mileage', 0)
            },
            centered: true
        });
    };

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Buyurtmalar', link: '/order/list' },
                    { title: order?.object_index as string },
                ]}
            />
            <Row gutter={[48, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div className='d-flex jc-sb gap-8 fw-wrap'>  
                                <Title level={3}>Ma’lumotlar</Title>
                                <Space size="small">
                                    {[ORDER_STATUS.BOOKED, ORDER_STATUS.CREATED]
                                        .includes(order?.status as ORDER_STATUS) && (
                                        <Button
                                            size="large"
                                            onClick={() =>
                                                navigate(
                                                    '/order/'.concat(
                                                        orderID?.toString() as string,
                                                        '/edit'
                                                    )
                                                )
                                            }
                                        >
                                            O’zgartirish
                                        </Button>
                                    )}
                                    <Button
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/order/'.concat(
                                                    orderID?.toString() as string,
                                                    '/logs'
                                                )
                                            )
                                        }
                                    >
                                        Tarix
                                    </Button>
                                    {order?.status === ORDER_STATUS.CREATED && (
                                        <Button 
                                            size="large" 
                                            type='primary' 
                                            onClick={() => confirm('finish')}
                                        >
                                            Закрыть
                                        </Button>
                                    )}
                                    {order?.status === ORDER_STATUS.BOOKED && (
                                        <Button 
                                            size="large" 
                                            type='primary' 
                                            onClick={() => confirm('activate')}
                                        >
                                            Активировать
                                        </Button>
                                    )}
                                    {[ORDER_STATUS.BOOKED, ORDER_STATUS.CREATED]
                                        .includes(order?.status as ORDER_STATUS) && (
                                        <Button size="large" onClick={() => confirm('cancel')}>
                                            Отменить
                                        </Button>
                                    )}
                                </Space>

                            </div>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[12, 12]}>
                                <Col span={24}>
                                    <Label>Mijoz va filial ma’lumotlari</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Buyurtma ID</StyledTextL1>
                                        <StyledTextL2>{order?.object_index ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Status</StyledTextL1>
                                        <StyledTextL2>
                                            <Status value={order?.status as ORDER_STATUS} type='order'>
                                                {getStatus(order?.status as ORDER_STATUS, 'order') ?? '-'}
                                            </Status>
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1 className='d-flex gap-8 jc-start'>
                                            <Status value={orderCustomer?.status as CLIENT_STATUS} type='client'>
                                                {getStatus(orderCustomer?.status as CLIENT_STATUS, 'client') ?? '-'}
                                            </Status>
                                            Mijoz
                                        </StyledTextL1>
                                        <StyledTextL2>{orderCustomer?.full_name ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Filial</StyledTextL1>
                                        <StyledTextL2>{(order?.branch as TBranch)?.title ?? '-'}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Buyurtmani ochgan shaxs</StyledTextL1>
                                        <StyledTextL2>
                                            {(order?.creator as Account.DTO)?.full_name ?? "-"}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>

                                <Col span={24} className='mt-1'>
                                    <Label>Muddat va avtomobil ma’lumotlari</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Boshlanish sanasi</StyledTextL1>
                                        <StyledTextL2>{moment(order?.start_date as string).format('LL')}</StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='ai-center'>
                                        <div className='d-flex fd-col ai-start'>
                                            <StyledTextL1>Tugash sanasi</StyledTextL1>
                                            <StyledTextL2>{moment(order?.end_date as string).format('LL')}</StyledTextL2>
                                        </div>
                                        {order?.status === ORDER_STATUS.CREATED &&(
                                            <Button 
                                                type='primary' 
                                                onClick={() => setDateModal(true)} 
                                                icon={<PlusIcon color='white' style={{ width: 22, height: 22 }} />} 
                                            />
                                        )}
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Avtomobil makrasi</StyledTextL1>
                                        <StyledTextL2>
                                            {(orderCar?.brand as CarBrand.DTO)?.title ?? '-'}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Avtomobil modeli</StyledTextL1>
                                        <StyledTextL2>
                                            {orderCar?.model ?? '-'}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Avtomobil raqami</StyledTextL1>
                                        <StyledTextL2>
                                            {formatPlate(orderCar?.plate_number ?? '-')}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Buyurtmagacha yurgan yo’li (km)</StyledTextL1>
                                        <StyledTextL2>
                                            {orderCar?.mileage ?? '-'}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>

                                <Col span={24} className='mt-1'>
                                    <Label>To’lov ma’lumotlari</Label>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Umumiy summa</StyledTextL1>
                                        <StyledTextL2>
                                            {(daysDifference * (orderCar?.payment ?? 0)).toLocaleString()}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Bonus</StyledTextL1>
                                        <StyledTextL2>
                                            {((order?.bonus ?? 0) * (orderCar?.payment ?? 0)).toLocaleString()}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>To’lov</StyledTextL1>
                                        <StyledTextL2>
                                            {((daysDifference - (order?.bonus ?? 0)) * (orderCar?.payment ?? 0))
                                                .toLocaleString()}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                                <Col span={12}>
                                    <BorderBox className='fd-col'>
                                        <StyledTextL1>Zaklad</StyledTextL1>
                                        <StyledTextL2>
                                            {orderCar?.booking_cost?.toLocaleString() ?? '-'}
                                        </StyledTextL2>
                                    </BorderBox>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <OrderCard>
                                <Row gutter={[0, 16]}>
                                    <Col span={24}>
                                        <StyledTextL2>Doverennost va dogovor</StyledTextL2>
                                    </Col>
                                    <Col span={24}>
                                        <div className='d-flex gap-24 jc-start fw-wrap'>
                                            <div className='d-flex fd-col ai-start gap-8'>
                                                <Document>
                                                    <DocumentIcon />
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledButton type='button' 
                                                            onClick={() => 
                                                                viewDocument(order?.doverennost?.file ?? "")
                                                            }>
                                                            Ko’rish
                                                        </StyledButton>
                                                        <StyledButton type='button'
                                                            onClick={() => 
                                                                downloadDocument(order?.doverennost?.file ?? "")
                                                            }>
                                                            Yuklash
                                                        </StyledButton>
                                                    </div>
                                                </Document>
                                                <StyledTextL2 fs={14}>Doverennost  hujjati</StyledTextL2>
                                            </div>
                                            <div className='d-flex fd-col ai-start gap-8'>
                                                <Document>
                                                    <DocumentIcon />
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledButton type='button' 
                                                            onClick={() => 
                                                                viewDocument(order?.dogovor?.file ?? "")
                                                            }>
                                                            Ko’rish
                                                        </StyledButton>
                                                        <StyledButton type='button'
                                                            onClick={() => 
                                                                downloadDocument(order?.dogovor?.file ?? "")
                                                            }>
                                                            Yuklash
                                                        </StyledButton>
                                                    </div>
                                                </Document>
                                                <StyledTextL2 fs={14}>Dogovor  hujjati</StyledTextL2>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </OrderCard>
                        </Col>
                        <Col span={24}>
                            <OrderCard>
                                <Row gutter={[0, 16]}>
                                    <Col span={24}>
                                        <div className='d-flex gap-4 jc-sb'>
                                            <StyledTextL2>Jarimalar va harajatlar</StyledTextL2>
                                            <Button 
                                                type='default' 
                                                onClick={() => setIsOpenPayment(true)} 
                                                icon={<PlusIcon />} 
                                                className='d-flex'
                                            >
                                                Qo’shish
                                            </Button>
                                        </div>
                                    </Col>
                                    {isOpenPayment && (
                                        <Col span={24}>
                                            <Payment
                                                btnText="Harajat qo’shish"
                                                onClose={() => setIsOpenPayment(false)} 
                                                onSubmit={(data) => addExpense(data)}
                                            />
                                        </Col>
                                    )}
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
                            </OrderCard>
                        </Col>
                        <Col span={24}>
                            <OrderCard>
                                <Row gutter={[0, 16]}>
                                    <Col span={24}>
                                        <StyledTextL2>Rasmlar</StyledTextL2>
                                    </Col>
                                    <Col span={24}>
                                        <CustomUpload   
                                            fileList={imageFiles} 
                                            onChange={changeImage}
                                            onRemove={removeImage} 
                                        />
                                    </Col>
                                </Row>
                            </OrderCard>
                        </Col>
                        <Col span={24}>
                            <OrderCard>
                                <Row gutter={[0, 16]}>
                                    <Col span={24}>
                                        <div className='d-flex gap-4 jc-sb'>
                                            <StyledTextL2>Qaydlar</StyledTextL2>
                                            <Button 
                                                type='default' 
                                                className='d-flex'
                                                icon={<PlusIcon />} 
                                            >
                                                Qo’shish
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <Expenses>
                                            {[  'Haydovchi tezlikni oshirdi (14:00, 23-mart, 2023 y)',
                                                'Haydovchi tezlikni oshirdi (14:00, 27-mart, 2023 y)',
                                                'Haydovchi tezlikni oshirdi (14:00, 1-aprel, 2023 y)'
                                            ].map((el, index) => (
                                                <li key={index}>
                                                    <StyledTextL1 fs={16}>{index + 1}. {el}</StyledTextL1>
                                                </li>
                                            ))}
                                        </Expenses>
                                    </Col>
                                </Row>
                            </OrderCard>
                        </Col>                       
                    </Row>
                </Col>
            </Row>
            {contextHolder}
            <Modal
                width={400}
                okText="Tasdiqlsh"
                cancelText="Bekor qilish"
                centered
                open={dateModal}
                onOk={confirmExtendDate}
                onCancel={hideDateModal}
            >
                <Form>
                    <Form.Item
                        name="end_date"
                        label="Uzaytirish sanasi"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos sanani kiriting',
                            },
                        ]}
                    >
                        <CustomDatePicker
                            size='large'
                            style={{ width: '100%'}}
                            placeholder='Sanani tanlang' 
                            value={extendDate}
                            onChange={extendDateHandler}
                            disabledDate={
                                date => disabledDate(date as Dayjs)
                            }                        
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const Document = styled.div`
    width: 200px;
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 16px 12px;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.02), 
        0px 1px 6px -1px rgba(0, 0, 0, 0.02), 
        0px 1px 2px 0px rgba(0, 0, 0, 0.03);

    svg {
        width: 48px;
        height: 48px;
    }
`

const StyledButton = styled.button`
    border: none;
    font-size: 14px;
    background: none;
    font-weight: 500;
    color: var(--black-65);
    border-bottom: 1px solid;
    cursor: pointer;
`

const Expenses = styled.ul`
    li {
        list-style: none;
        display: flex;
        gap: 8px;
        align-items: flex-start;
        flex-direction: column;
    }
`
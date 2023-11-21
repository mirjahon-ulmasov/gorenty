
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
    Button, Col, DatePickerProps, 
    Row, Space, Typography, 
    Checkbox, Modal, UploadFile
} from 'antd'
import clsx from 'clsx';
import moment from 'moment'
import { UploadChangeParam } from 'antd/es/upload';
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast';
import { useAppSelector } from 'hooks/redux';
import { 
    CustomBreadcrumb, Payment, Label, 
    StyledTextL1, StyledTextL2, BorderBox, 
    CustomDatePicker, IDTag, StyledLink, 
    BillingHistory, Status, CustomUpload, LogList  
} from 'components/input'
import { BucketFile, CarBrand, Investor } from 'types/api'
import { 
    useAddCarImageMutation, useBlockCarMutation, 
    useDeleteCarImageMutation, useFetchCarQuery, 
    useUnblockCarMutation, useCarIncomeMutation,
    useFetchPaymentLogsQuery,
    useInvestorCarDebtIncomeMutation
} from 'services'
import { LockIcon } from 'components/input'
import { CAR_STATUS, ID, ROLE, TRANSACTION } from 'types/index';
import { formatPlate, getStatus } from 'utils/index';
import { PaymentLog } from 'types/branch-payment';

const { Title } = Typography

interface LogType extends PaymentLog.DTO {
    open_payment: boolean
}

export default function CarDetail() {
    const navigate = useNavigate()
    const { carID } = useParams()
    const [modal, contextHolder] = Modal.useModal();
    const [isOpenPayment, setIsOpenPayment] = useState(false);
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
    const [logs, setLogs] = useState<LogType[]>([]);

    const { data: car, isError } = useFetchCarQuery(carID as string)
    const { user } = useAppSelector(state => state.auth)
    const { data: paymentLogs } = useFetchPaymentLogsQuery({
        vehicle: carID
    })
    
    const [blockCar] = useBlockCarMutation()
    const [unblockCar] = useUnblockCarMutation()
    const [addCarImage] = useAddCarImageMutation()
    const [deleteCarImage] = useDeleteCarImageMutation()

    const [carIncome] = useCarIncomeMutation()
    const [investorCarDebtIncome] = useInvestorCarDebtIncomeMutation()

    useEffect(() => {
        setLogs(paymentLogs?.results?.map(log => ({
            ...log,
            open_payment: false
        })) || []);
      }, [paymentLogs]);

    useEffect(() => {
        if(isError) return;

        if(car?.vehicle_images) {
            setImageFiles((car?.vehicle_images as BucketFile[]).map(file => ({
                uid: uuid(),
                response: file,
                status: 'done',
                name: 'image.png',
                url: file.image.file
            })))
        }
    }, [car, isError])


    const changeLog = useCallback((id: ID, key: keyof LogType, value: unknown) => {
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

    // ------------- Image Upload -------------
    function changeImage(data: UploadChangeParam<UploadFile<any>>) {
        setImageFiles(data.fileList)

        if(data.file.status !== 'done') return;

        addCarImage({ 
            vehicle: parseInt(carID as string, 10), 
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
                                
        return deleteCarImage({ id: data.response.id })
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

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const addExpense = useCallback((data: PaymentLog.DTOUpload) => {
        carIncome({ ...data, vehicle: car?.id as ID }).unwrap()
            .then(() => {
                setIsOpenPayment(false)
                toast.success("Harajat qo’shildi")
            })
            .catch(() => toast.error("Что-то пошло не так"))
    }, [car?.id, carIncome])   

    const closeExpense = useCallback((data: PaymentLog.DTOUpload, log: LogType) => {
        investorCarDebtIncome({ ...data, vehicle: car?.id as ID, debt: log.id }).unwrap()
            .then(() => {
                changeLog(log.id, 'open_payment', false)
                toast.success("Harajat yopildi")
            })
            .catch(() => toast.error("Что-то пошло не так"))
    }, [car?.id, changeLog, investorCarDebtIncome])

    const confirm = () => {
        modal.confirm({
            title: car?.status === CAR_STATUS.BLOCK 
                ? "Хотите разблокировать машину?"
                : 'Хотите заблокировать машину?',
            icon: <ExclamationCircleOutlined />,
            content: "",
            okText: 'Подтвердить',
            cancelText: 'Отменить',
            onOk() {
                if(!car?.id) return;

                if(car?.status === CAR_STATUS.BLOCK ) {
                    unblockCar(car.id)
                } else {
                    blockCar(car.id)
                }
            },
            centered: true
        });
    };

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Avtomobillar', link: '/car/list' },
                    { title: formatPlate(car?.plate_number ?? '-') },
                ]}
            />
            <Row gutter={[48, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div className='d-flex jc-sb gap-8 fw-wrap'>  
                                <IDTag>{car?.object_index}</IDTag>
                                <Title level={3}>{formatPlate(car?.plate_number ?? '-')}</Title>
                                {user?.state === ROLE.ADMIN && (
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
                                            {car?.status !== CAR_STATUS.BLOCK ? "Bloklash" : "Blokdan chiqarish"}
                                        </Button>
                                    </Space>
                                )}
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
                                        <StyledTextL2>
                                            {formatPlate(car?.plate_number ?? '-')}
                                        </StyledTextL2>
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
                                <Col span={24} className='mt-1'>
                                    <BorderBox className='fd-col'>
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
                                    </BorderBox>
                                </Col>
                                <Col span={24}>
                                    <StyledLink to='/order/list' state={{ vehicle: carID }} className='ml-1'>
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
                                    <Payment
                                        btnText="Harajat qo’shish"
                                        onClose={() => setIsOpenPayment(false)} 
                                        onSubmit={(data) => addExpense(data)}
                                    />
                                </Col>
                            )}
                            <LogList mh={60}>
                                {logs.map(log => (
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
                                                    {log.total.toLocaleString()} so’m
                                                </StyledTextL2>
                                                <StyledTextL1>{moment(log.created_at).format('LL')}</StyledTextL1>
                                            </div>
                                        </div>
                                        <div className='d-flex fd-col ai-start gap-16'>
                                            {log.is_debt && (
                                                <Button 
                                                    type='default' 
                                                    onClick={() => changeLog(log.id, 'open_payment', true)}
                                                >
                                                    Bajarish
                                                </Button> 
                                            )}
                                            {log.open_payment && (
                                                <Payment
                                                    btnText="Harajat to’lash"
                                                    onClose={() => changeLog(log.id, 'open_payment', false)}
                                                    onSubmit={(data) => closeExpense(data, log)}
                                                />
                                            )}
                                        </div>
                                    </BorderBox>
                                ))}
                            </LogList>
                            {/* {[
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
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </BorderBox>
                                </Col>
                            ))} */}
                        </Row>
                    </BillingHistory>
                </Col>
            </Row>
            {contextHolder}
        </>
    )
}
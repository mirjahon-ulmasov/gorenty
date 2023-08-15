import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { 
    Button, Col, DatePickerProps,
    Divider, Form,  InputNumber, Row, 
    Space, Typography, UploadFile
} from 'antd'
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import moment from 'moment';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast';
import { UploadChangeParam } from 'antd/es/upload';
import { 
    useFetchClientsQuery, useFetchCarBrandsQuery, 
    useFetchCarsQuery, useUpdateOrderMutation, useFetchOrderQuery, useAddOrderImageMutation, useDeleteOrderImageMutation 
} from 'services'
import { 
    CustomBreadcrumb, CustomDatePicker, 
    CustomSelect, CustomUpload, OrderCard, 
    Payment, Status, StyledTextL1, StyledTextL2 
} from 'components/input'
import { useAppSelector } from 'hooks/redux';
import { disabledDate, formatDate, getStatus } from 'utils/index';
import { CAR_STATUS, CLIENT_STATUS, ORDER_STATUS } from 'types/index';
import { BucketFile, Car, CarBrand, Client, Order, TBranch } from 'types/api';
import { PlusIcon } from 'components/input';
import 'moment/dist/locale/ru'

const { Title } = Typography

export default function EditOrder() {
    moment.locale('ru');
    const navigate = useNavigate();
    const { orderID } = useParams()
    const [isOpenPayment, setIsOpenPayment] = useState(false);
    const [bonus, setBonus] = useState<number | null>(null)

    const [form] = Form.useForm()
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])    

    const [client, setClient] = useState<Client.DTO | null>(null);
    const [searchedClient, setSearchedClient] = useState('')

    const [car, setCar] = useState<Car.DTO | null>(null)
    const [searchedCar, setSearchedCar] = useState('')
    const [brandID, setBrandID] = useState<number | null>(null)

    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [endDate, setEndDate] = useState<Dayjs | null>(null)

    const { data: order, isError } = useFetchOrderQuery(orderID as string)
    const { data: clients, isLoading: clientsLoading } = useFetchClientsQuery({ search: searchedClient })
    const { data: carBrands, isLoading: carBrandsLoading } = useFetchCarBrandsQuery({})
    const { data: cars, isLoading: carsLoading } = useFetchCarsQuery(
        { brand: [brandID as number], plate_number: searchedCar, status: CAR_STATUS.FREE }, 
        { skip: !brandID }
    )
    const [editOrder, { isLoading: editLoading }] = useUpdateOrderMutation()
    const [addOrderImage] = useAddOrderImageMutation()
    const [deleteOrderImage] = useDeleteOrderImageMutation()
    const { user } = useAppSelector(state => state.auth)

    useEffect(() => {       
        if(isError) return;

        const customer = order?.customer as Client.DTO
        const car = order?.vehicle as Car.DTO
        const brandID = ((order?.vehicle as Car.DTO)?.brand as CarBrand.DTO)?.id

        setCar(car)
        setClient(customer)
        setBrandID(brandID ?? null)
        setBonus(order?.bonus ?? null)        
        setStartDate(dayjs(order?.start_date))
        setEndDate(dayjs(order?.end_date))        

        form.setFieldsValue({
            ...order,
            customer: customer?.id,
            start_date: dayjs(order?.start_date),
            end_date: dayjs(order?.end_date),
            model: brandID,
            vehicle: car?.id,
            mileage: car?.mileage,
            branch: (order?.branch as TBranch)?.id
        })
        if(order?.order_images) {
            setImageFiles((order?.order_images as BucketFile[]).map(file => ({
                uid: uuid(),
                response: file,
                status: 'done',
                name: 'image.png',
                url: file.image.file
            })))
        }
    }, [form, order, isError])

    // ---------------- Client ----------------
    const changeClient = (value: number) => {        
        const foundClient = clients?.results?.find(client => client.id === value) as Client.DTO
        setClient(foundClient)
    };
      
    const searchClient = (value: string) => {        
        setSearchedClient(value);
    };

    // ---------------- Car ----------------
    function changeCar(value: number) {        
        const foundCar = cars?.results?.find(car => car.id === value) as Car.DTO
        setCar(foundCar)
    }

    const searchCar = (value: string) => {        
        setSearchedCar(value);
    };

    // ---------------- Dates ----------------
    const startDateHandler: DatePickerProps['onChange'] = (date) => {
        setStartDate(date as Dayjs);
    };

    const endDateHandler: DatePickerProps['onChange'] = (date) => {
        setEndDate(date as Dayjs);
    };

    const daysDifference = useMemo(() => {        
        return (startDate && endDate) ? endDate.diff(startDate, 'day') : 0;
    }, [startDate, endDate])


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

    // ---------------- Submit ----------------
    const onFinish = (values: Order.DTO) => {            

        const data: Order.DTO = {
            ...order,
            ...values,
            creator: user?.id,
            start_date: startDate?.format(formatDate),
            end_date: endDate?.format(formatDate),
            order_images: imageFiles.map(file => file.response.id),
        }

        editOrder(data)
            .unwrap()
            .then(() => {
                toast.success("Заявка успешно создан")
                navigate('/order/list')
            })
            .catch(() => toast.error("Не удалось создать заявка"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)
    }
    
    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Buyurtmalar', link: '/order' },
                    { title: order?.object_index as string, link: `/order/${orderID}/detail` },
                    { title: 'Ma’lumotlarni o’zgartirish' },
                ]}
            />
            <Row gutter={[0, 48]}>
                <Col span={12}>
                    <Title level={3}>Ma’lumotlarni o’zgartirish</Title>
                    <Form
                        form={form}
                        autoComplete="off"
                        style={{ maxWidth: 500, marginTop: '1rem' }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row gutter={[24, 8]}>
                            <Col span={24}>
                                <Form.Item
                                    name="customer"
                                    label="Mijoz"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        showSearch
                                        allowClear
                                        size='large'
                                        value={client?.id}
                                        onChange={changeClient}
                                        filterOption={false}
                                        searchValue={searchedClient}
                                        onSearch={searchClient}
                                        style={{ maxWidth: 320 }}
                                        placeholder="Mijozni tanlang"
                                        loading={clientsLoading}
                                        options={clients?.results?.map((client) => ({
                                            value: client.id,
                                            label: client.full_name,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Divider style={{ margin: '16px 0' }}/>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="start_date"
                                    label="Boshlanish sanasi"
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
                                        value={startDate}
                                        onChange={startDateHandler} 
                                        disabledDate={
                                            date => disabledDate(date as Dayjs)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="end_date"
                                    label="Tugash sanasi"
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
                                        value={endDate}
                                        onChange={endDateHandler}
                                        disabledDate={
                                            date => disabledDate(date as Dayjs)
                                        }                                        
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="bonus"
                                    label="Bonus kun"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <InputNumber 
                                        min={0}
                                        size="large" 
                                        placeholder='5'
                                        value={bonus}
                                        onChange={value => setBonus(value)} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Buyurtma statusi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos buyurtma statusini kiriting',
                                        },
                                    ]}
                                >
                                    <CustomSelect
                                        size="large"
                                        allowClear
                                        options={[
                                            {
                                                value: ORDER_STATUS.BOOKED,
                                                label: getStatus(ORDER_STATUS.BOOKED, 'order'),
                                            },
                                            {
                                                value: ORDER_STATUS.CREATED,
                                                label: getStatus(ORDER_STATUS.CREATED, 'order'),
                                            },
                                            {
                                                value: ORDER_STATUS.CANCELLED,
                                                label: getStatus(ORDER_STATUS.CANCELLED, 'order'),
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Divider style={{ margin: '8px 0 16px' }}/>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="model"
                                    label="Avtomobil markasi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos avtomobil markasini tanlang',
                                        },
                                    ]}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        value={brandID}
                                        onChange={value => setBrandID(value)} 
                                        placeholder='Tanlang'
                                        loading={carBrandsLoading}
                                        options={carBrands?.map(brand => ({
                                            value: brand.id,
                                            label: brand.title
                                        }))}
                                    />                                
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="vehicle"
                                    label="Avtomobil raqami"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos avtomobil raqamini tanlang',
                                        },
                                    ]}
                                >
                                    <CustomSelect
                                        showSearch
                                        allowClear
                                        size="large"
                                        value={car?.id}
                                        onChange={changeCar}
                                        filterOption={false}
                                        searchValue={searchedCar}
                                        onSearch={searchCar}
                                        loading={carsLoading}
                                        placeholder='Tanlang'
                                        options={cars?.results?.map(car => ({
                                            value: car.id,
                                            label: car.plate_number
                                        }))}
                                    />                    
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="mileage"
                                    label="Hozirda bosib o’tilgan masofasi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos bosib o’tilgan masofasi kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size='large' type='number' min={0} placeholder='10000' />                               
                                </Form.Item>
                            </Col>
                            <Col span={24} className='mt-1'>
                                <StyledTextL1 fs={16}>
                                    Belgilangan zaklad miqdori: {car?.booking_cost?.toLocaleString() ?? '-'}
                                </StyledTextL1>
                            </Col>
                            <Col span={24} className='mt-1'>
                                <CustomUpload 
                                    fileList={imageFiles} 
                                    onChange={changeImage}
                                    onRemove={removeImage} 
                                />
                            </Col>
                        </Row>
                        <div style={{ marginTop: 32 }}>
                            <Space size='large'>
                                <Button 
                                    type='primary' 
                                    size='large' 
                                    htmlType='submit' 
                                    loading={editLoading}
                                >
                                    O’zgarishlarn saqlash
                                </Button>
                                <Button size='large' onClick={() => navigate('/order')} >
                                    Bekor qilish
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Col>
                <Col span={12}>
                    <Row gutter={[0, 16]}>
                        {!!client && (
                            <Col span={24}>
                                <OrderCard className={clsx('animate__animated', 'animate__fadeInDown')}>
                                    <Row gutter={[0, 16]}>
                                        <Col span={24}>
                                            <StyledTextL1 fs={16}>Mijoz haqida ma’lumot</StyledTextL1>
                                        </Col>
                                        <Divider style={{ margin: 0 }}/>
                                        <Col span={24}>
                                            <div className='d-flex fd-col ai-start gap-4'>
                                                <StyledTextL2>{client?.full_name ?? '-'}</StyledTextL2>
                                                <div className='d-flex jc-sb w-100'>
                                                    <div className='fs-14 black-88'>
                                                        <Space>
                                                            Tizimga qo’shilgan sanasi:  
                                                            {moment(client?.created_at).format('LL')}
                                                        </Space>
                                                    </div>
                                                    <Status value={client.status as CLIENT_STATUS} type='client'>
                                                        {getStatus(client.status as CLIENT_STATUS, 'client')}
                                                    </Status>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <div className='d-flex gap-4 jc-sb'>
                                                <div className='d-flex fd-col ai-start gap-4'>
                                                    <StyledTextL1>Joriy balans</StyledTextL1>
                                                    <StyledTextL2 fs={20}>{client.balance}</StyledTextL2>
                                                </div>
                                                <Button type='default' onClick={() => setIsOpenPayment(true)} icon={<PlusIcon />} className='d-flex'>
                                                    Balansni to’ldirish
                                                </Button>
                                            </div>
                                        </Col>
                                        {isOpenPayment && (
                                            <Col span={24}>
                                                <Payment btnText='Balansni to’ldirish' onClose={() => setIsOpenPayment(false)} />
                                            </Col>
                                        )}
                                    </Row>
                                </OrderCard>
                            </Col>
                        )}
                        {(!!startDate && !!endDate) && (
                            <Col span={24}>
                                <OrderCard className={clsx('animate__animated', 'animate__fadeInDown')}>
                                    <Row gutter={[0, 16]}>
                                        <Col span={24}>
                                            <StyledTextL1 fs={16}>Ijara vaqti</StyledTextL1>
                                        </Col>
                                        <Divider style={{ margin: 0 }}/>
                                        <Col span={24}>
                                            <div className='d-flex gap-48 jc-start'>
                                                <div className='d-flex fd-col ai-start gap-4'>
                                                    <StyledTextL1>Boshlanish sanasi</StyledTextL1>
                                                    <StyledTextL2>{moment(startDate.toDate()).format('LL')}</StyledTextL2>

                                                </div>
                                                <div className='d-flex fd-col ai-start gap-4'>
                                                    <StyledTextL1>Tugash sanasi</StyledTextL1>
                                                    <StyledTextL2>{moment(endDate.toDate()).format('LL')}</StyledTextL2>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </OrderCard>
                            </Col>
                        )}
                        {!!car && (
                            <Col span={24}>
                                <OrderCard className={clsx('animate__animated', 'animate__fadeInDown')}>
                                    <Row gutter={[0, 16]}>
                                        <Col span={24}>
                                            <StyledTextL1 fs={16}>Avtomobil</StyledTextL1>
                                        </Col>
                                        <Divider style={{ margin: 0 }}/>
                                        <Col span={24}>
                                            <Row gutter={[48, 16]}>
                                                <Col span={12}>
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledTextL1>Markasi</StyledTextL1>
                                                        <StyledTextL2>
                                                            {(car?.brand as CarBrand.DTO)?.title ?? '-'}
                                                        </StyledTextL2>
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledTextL1>Modeli</StyledTextL1>
                                                        <StyledTextL2>
                                                            {car?.model ?? '-'}
                                                        </StyledTextL2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={24}>
                                            <Row gutter={[48, 16]}>
                                                <Col span={12}>
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledTextL1>Avtomobil raqami</StyledTextL1>
                                                        <StyledTextL2>
                                                            {car?.plate_number ?? '-'}
                                                        </StyledTextL2>
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledTextL1>Kunlik summa</StyledTextL1>
                                                        <StyledTextL2>
                                                            {car?.payment?.toLocaleString() ?? '-'}
                                                        </StyledTextL2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </OrderCard>
                            </Col>
                        )}
                        {(!!car && !!daysDifference) && (
                            <Col span={24}>
                                <OrderCard className={clsx('animate__animated', 'animate__fadeInDown')}>
                                    <Row gutter={[0, 16]}>
                                        <Col span={24}>
                                            <StyledTextL1 fs={16}>To’lov</StyledTextL1>
                                        </Col>
                                        <Divider style={{ margin: 0 }}/>
                                        <Col span={24}>
                                            <Row gutter={[48, 16]}>
                                                <Col span={8}>
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledTextL1>Umumiy summa</StyledTextL1>
                                                        <StyledTextL2>
                                                            {(daysDifference * (car.payment ?? 0))
                                                                .toLocaleString()}
                                                        </StyledTextL2>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledTextL1>Bonus</StyledTextL1>
                                                        <StyledTextL2>
                                                            {((bonus ?? 0) * (car.payment ?? 0))
                                                                .toLocaleString()}
                                                        </StyledTextL2>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div className='d-flex fd-col ai-start gap-4'>
                                                        <StyledTextL1>To’lov</StyledTextL1>
                                                        <StyledTextL2>
                                                            {((daysDifference - (bonus ?? 0)) * (car.payment ?? 0))
                                                                .toLocaleString()}
                                                        </StyledTextL2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </OrderCard>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    )
}
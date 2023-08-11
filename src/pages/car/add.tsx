/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import type { Dayjs } from 'dayjs';
import { 
    Button, Checkbox, Col, Row,
    Form, Input, InputNumber, Space, 
    Typography, UploadFile
} from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { 
    CustomSelect, CustomBreadcrumb, StyledTextL2, 
    CustomDatePicker, CustomUpload 
} from 'components/input'
import { useAppSelector } from 'hooks/redux';
import { useCreateCarMutation, useFetchBranchesQuery, useFetchCarBrandsQuery, useFetchInvestorsQuery } from 'services';
import { Car } from 'types/api';
import { disabledDate, formatDate } from 'utils/index';

const { Title } = Typography

export default function AddCar() {
    const navigate = useNavigate();
    const [isToning, setIsToning] = useState(false)
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
    const [searchedInvestor, setSearchedInvestor] = useState('')

    const [createCar] = useCreateCarMutation()
    const { data: brands, isLoading: brandsLoading } = useFetchCarBrandsQuery({})
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})
    const { data: investors, isLoading: investorsLoading } = useFetchInvestorsQuery({ search: searchedInvestor })
    const { user } = useAppSelector(state => state.auth)

    // ---------------- Toning ----------------

    function changeToning(e: CheckboxChangeEvent) {
        setIsToning(e.target.checked)
    }

    // ---------------- Submit ----------------
    const onFinish = (values: Car.DTO) => {

        const data: Car.DTO = {
            ...values,
            creator: user?.id,
            toning: (values?.toning as Dayjs)?.format(formatDate),
            oil_date: (values?.oil_date as Dayjs)?.format(formatDate),
            insurance: (values?.insurance as Dayjs)?.format(formatDate),
            lease_term: (values?.lease_term as Dayjs)?.format(formatDate),
            technical_passport_date: (values?.technical_passport_date as Dayjs)?.format(formatDate),
            vehicle_images: imageFiles.map(file => file.response.id),
        }    
        
        createCar(data)
            .unwrap()
            .then(() => {
                toast.success("Автомобиль успешно создан")
                navigate('/car/list')
            })
            .catch(() => toast.error("Не удалось создать автомобиль"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Avtomobillar', link: '/car/list' },
                    { title: 'Yangi avtomobil qo’shish' },
                ]}
            />
            <Title level={3}>Yangi avtomobil qo’shish</Title>
            <Form
                autoComplete="off"
                style={{ maxWidth: 1200, marginTop: 20 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    vehicle_key: false,
                    alarm_lucky_remote: false,
                    osago_policy_original: false,
                    radio_tape_recorder: false,
                    cigarette_lighter: false,
                    rubber_mats_set: false,
                    state_numbers: false,
                    baby_chair: false,
                    ski_carrier_set: false,
                    radar_detector_and_dvd: false,
                    balloon_wrench: false,
                    tires: false,
                    wheel_disks: false,
                    warning_triangle: false,
                    first_aid_kit: false,
                    fire_extinguisher: false,
                    user_manual: false,
                    odometer_reading: false,
                }}
            >
                <Row gutter={[48, 0]}>
                    {/* LEFT SIDE  */}
                    <Col span={12}>
                        <Row gutter={[24, 8]}>
                            <Col span={24}>
                                <StyledTextL2>Avtomobil ma’lumotlari</StyledTextL2>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="plate_number"
                                    label="Davlat raqami"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos davlat raqamini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Avtomobil davlat raqami'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="branch"
                                    label="Fillial"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos fillialni tanlang',
                                        },
                                    ]}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        placeholder='Tanlang'
                                        loading={branchesLoading}
                                        options={branches?.map(branch => ({
                                            value: branch.id,
                                            label: branch.title
                                        }))}
                                    ></CustomSelect>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="brand"
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
                                        placeholder='Tanlang'
                                        loading={brandsLoading}
                                        options={brands?.map(brand => ({
                                            value: brand.id,
                                            label: brand.title
                                        }))}
                                    />                                
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="model"
                                    label="Avtomobil modeli"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos avtomobil modelini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Gentra 4-pozitsiya'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="investor"
                                    label="Investor"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos investorni tanlang',
                                        },
                                    ]}
                                >
                                    <CustomSelect
                                        showSearch
                                        allowClear
                                        size="large"
                                        filterOption={false}
                                        searchValue={searchedInvestor}
                                        onSearch={value => setSearchedInvestor(value)}
                                        placeholder='Investorni tanlang'
                                        loading={investorsLoading}
                                        options={investors?.results?.map(investor => ({
                                            value: investor.id,
                                            label: investor.full_name
                                        }))}
                                    />                                
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="investor_share"
                                    label="Investor ulushi (foizda)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos investor ulushini kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Ulushni yozing'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="payment"
                                    label="Kunlik narxi (so’mda)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos kunlik narxini kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Narxni yozing'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="booking_cost"
                                    label="Zaklad (so’mda)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos zaklad narxini kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Narxni yozing'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="fine_payment"
                                    label="Har kilometrga jarima (so’mda)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos jarimani kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Narxni yozing'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="limited_mileage_per_day"
                                    label="Kunlik masofa (km)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos kunlik masofani kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Kilometrda'/>
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{ marginTop: '1rem' }}>
                                <StyledTextL2>Avtomobil ko’rsatkichlari va muddatlar</StyledTextL2>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="mileage"
                                    label="Bosib o’tgan yo’li (km)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos bosib o’tgan yo’lni kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Kilometrda'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="issue_year"
                                    label="Год выпуска"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <InputNumber size="large" placeholder='Год выпуска'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="lease_term"
                                    label="Ijara shartnomasi muddati"
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
                                        style={{ width: '100%' }}
                                        placeholder='Sanani tanlang' 
                                        disabledDate={
                                            date => disabledDate(date as Dayjs)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="insurance"
                                    label="Sug’urta muddati"
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
                                        style={{ width: '100%' }}
                                        placeholder='Sanani tanlang' 
                                        disabledDate={
                                            date => disabledDate(date as Dayjs)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Row align='middle' style={{ marginTop: 16 }}>
                                    <Col flex='150px'>
                                        <Form.Item
                                            name="is_toned"
                                            valuePropName='checked'
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Checkbox checked={isToning} onChange={changeToning}>
                                                Tonirovka
                                            </Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col flex='auto'>
                                        <Form.Item
                                            name="toning"
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <CustomDatePicker
                                                size='large'
                                                style={{ width: '100%'}}
                                                placeholder='Sanani tanlang' 
                                                disabled={!isToning}
                                                disabledDate={
                                                    date => disabledDate(date as Dayjs)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} className='mt-1'>
                                <CustomUpload 
                                    fileList={imageFiles} 
                                    onChange={(info) => setImageFiles(info.fileList)}
                                />
                            </Col>
                        </Row>
                    </Col>
                    {/* RIGHT SIDE  */}
                    <Col span={12}>
                        <Row gutter={[24, 8]}>
                            <Col span={24}>
                                <StyledTextL2>Moy ma’lumotlari</StyledTextL2>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="oil_initial_path"
                                    label="Bosib o’tgan yo’li (km)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos bosib o’tilgan yo’lni kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Kilometrda'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="oil_update_path"
                                    label="Keyingi quyiladigan (km)"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos keyingi quyiladigan km kiriting',
                                        },
                                    ]}
                                >
                                    <InputNumber size="large" type='number' placeholder='Kilometrda'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="oil_date"
                                    label="Oxirgi moy qo’yilgan sana"
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
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="oil_brand"
                                    label="Quyilgan moy markasi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos quyilgan moy markasini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Moy markasi nomi'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="technical_passport_date"
                                    label="Texnik passport muddati"
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
                                        disabledDate={
                                            date => disabledDate(date as Dayjs)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="technical_passport"
                                    label="Texnik passport"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos texnik passport kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Texnik passport'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="engine"
                                    label="Двигатель"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input size="large" placeholder='Двигатель'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="body"
                                    label="Тело"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input size="large" placeholder='Тело'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="chassis"
                                    label="Шасси"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input size="large" placeholder='Шасси'/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="color"
                                    label="Цвет"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input size="large" placeholder='Цвет'/>
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{ marginTop: '1rem' }}>
                                <StyledTextL2>Qo’shimcha ko’rsatkichlar</StyledTextL2>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="vehicle_key"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>  
                                        Ключ от автомобиля
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="alarm_lucky_remote"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Сигнализация
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="osago_policy_original"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>  
                                        Оригинал полиса осаго
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="radio_tape_recorder"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Радиомагнитофон
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="cigarette_lighter"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Прикуриватель для сигарет
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="rubber_mats_set"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Набор резиновых ковриков
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="state_numbers"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Государственные номера
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="baby_chair"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Детское кресло
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="ski_carrier_set"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Комплект для переноски лыж
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="radar_detector_and_dvd"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Радар-детектор и DVD
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="balloon_wrench"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Баллонный ключ
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="tires"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Шины
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="wheel_disks"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Колесные диски
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="warning_triangle"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Предупреждающий треугольник
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="first_aid_kit"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Аптечка первой помощи
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="fire_extinguisher"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Огнетушитель
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="user_manual"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Руководство пользователя
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="odometer_reading"
                                    valuePropName='checked'
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox>
                                        Показания одометра
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div style={{ marginTop: 30 }}>
                    <Space size='large'>
                        <Button type='primary' size='large' htmlType='submit'>Yangi avtomobil qo’shish</Button>
                        <Button size='large' onClick={() => navigate('/car/list')} >Bekor qilish</Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}
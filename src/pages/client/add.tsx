/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Col, Form, Input, 
    Row, Space, Typography, UploadFile 
} from 'antd'
import toast from 'react-hot-toast'
import type { Dayjs } from 'dayjs';
import _ from 'lodash'
import { useCreateClientMutation } from 'services/client'
import { useFetchBranchesQuery } from 'services/branch'
import { CustomSelect, CustomBreadcrumb, CustomUpload, CustomDatePicker } from 'components/input'
import { Client } from 'types/api'
import { formatDate } from 'utils/index';
import { PlusIcon } from 'assets/images/Icons';
import clsx from 'clsx';

const { Title } = Typography

export default function AddClient() {
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
    const [clientRecords, setClientRecords] = useState<Client.Record[]>([])

    const [createClient] = useCreateClientMutation()
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})

    // ---------------- Client Record ----------------

    function addNewRecord() {
        setClientRecords(prev => [ 
            ...prev,
            { full_name: "", birth_date: '' }
        ])
    }

    function changeRecordName(e: ChangeEvent<HTMLInputElement>, index: number) {
        setClientRecords(prev => prev.map((el, idx) => {
            if(idx === index) {
                return { ...el, full_name: e.target.value }
            }
            return el
        }))
    }

    function changeRecordBirthDate(date: Dayjs | null, index: number) {
        setClientRecords(prev => prev.map((el, idx) => {
            if(idx === index) {
                return { ...el, birth_date: date as Dayjs }
            }
            return el
        }))
    }

    function deleteRecord(index: number) {
        setClientRecords(prev => prev.filter((_, idx) => idx !== index))
    }

    // ---------------- Submit ----------------
    const onFinish = (values: Client.DTO) => {

        const data: Client.DTO = {
            ...values,
            customer_images: imageFiles.map(file => file.response.id),
            birth_date: (values?.birth_date as Dayjs)?.format(formatDate),
            customer_records: clientRecords
                .filter(record => record.birth_date && record.full_name)
                .map(record => ({
                    full_name: record.full_name,
                    birth_date: (record.birth_date as Dayjs).format(formatDate)
                })),
            phone_number: _.replace(values.phone_number ?? '', /\D/g, '')
        }

        createClient(data)
            .unwrap()
            .then(() => {
                toast.success("Клиент успешно создан")
                navigate('/client/list')
            })
            .catch(() => toast.error("Не удалось создать клиент"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Mijozlar', link: '/client/list' },
                    { title: 'Yangi mijoz qo’shish' },
                ]}
            />
            <Title level={3}>Yangi mijoz qo’shish</Title>
            <Form
                autoComplete="off"
                style={{ maxWidth: 1000 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[48, 0]}>
                    <Col span={12}>
                        <Row gutter={[0, 8]}>
                            <Col span={24}>
                                <Form.Item
                                    name="full_name"
                                    label="Mijoz ism-sharifi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos mijozning ismini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Ism-sharifi'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="phone_number"
                                    label="Mijoz telefon raqami"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        { required: true, message: 'Iltimos telefon raqam kiriting' },
                                        { max: 13, message: 'Telefon raqam 13tadan oshmasligi kerak' },
                                        { min: 12, message: 'Telefon raqam 12tadan kam bo’lmasligi kerak' },
                                    ]}
                                >
                                    <Input size="large" placeholder='+99890 777 66 55'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="birth_date"
                                    label="Mijozning tug’ilgan yili"
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
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="address"
                                    label="Mijoz adressi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos mijozning adressini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='17 uy, Chilonzor tumani, Tashkent'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="passport_number"
                                    label="Passport ID"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos mijozning pasportini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='AA 000 00 00'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="licence"
                                    label="Haydovchilik guvohnomasi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos mijozning guvohnomasini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='123456789'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
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
                            <Col span={24} className='mt-1'>
                                <CustomUpload
                                    fileList={imageFiles} 
                                    onChange={(info) => setImageFiles(info.fileList)}
                                />
                            </Col>
                        </Row>
                    </Col>
                    
                    <Col span={12} style={{ background: '#f8f8f8', padding: 24 }}>
                        <Row gutter={[0, 24]}>
                            <Col span={24}>
                                <p className='mb-05'>Mijozning tanishlari</p>
                                <Button 
                                    size='large' 
                                    className='d-flex' 
                                    icon={<PlusIcon />}
                                    onClick={addNewRecord}
                                >
                                    Mijozning tanishlarini qo’shish
                                </Button>
                            </Col>
                            {clientRecords.map((el, index) => (
                                <Col span={24} key={index}>
                                    <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Space size='middle'>
                                            <Input 
                                                size="large"
                                                name='full_name'
                                                value={el.full_name} 
                                                onChange={e => changeRecordName(e, index)} 
                                                placeholder='Ism-sharif'
                                            />
                                            <CustomDatePicker
                                                size='large'
                                                style={{ width: '100%' }}
                                                placeholder='Sanani tanlang'
                                                value={el.birth_date as Dayjs}
                                                onChange={date => changeRecordBirthDate(date as Dayjs, index)}
                                            />
                                        </Space>
                                    </Form.Item>
                                    <Space className={clsx('mt-05', 'animate__animated', 'animate__fadeIn')}>
                                        {/* <Button size='large' type='primary' onClick={() => createCurrency(el)}>
                                            O’zgartirish
                                        </Button> */}
                                        <Button size='large' onClick={() => deleteRecord(index)}>
                                            Bekor qilish
                                        </Button>
                                    </Space>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
                <div style={{ marginTop: '1rem' }}>
                    <Space size='large'>
                        <Button type='primary' size='large' htmlType='submit'>Yangi mijoz qo’shish</Button>
                        <Button size='large' onClick={() => navigate('/client/list')} >Bekor qilish</Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}
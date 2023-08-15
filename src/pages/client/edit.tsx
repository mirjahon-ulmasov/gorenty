/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography, UploadFile } from 'antd'
import _ from 'lodash';
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { 
    useAddClientImageMutation, useCreateClientRecordMutation, useDeleteClientImageMutation, 
    useDeleteClientRecordMutation, 
    useFetchClientQuery, useUpdateClientMutation, useUpdateClientRecordMutation 
} from 'services/client'
import { useFetchBranchesQuery } from 'services/branch'
import { CustomSelect, CustomBreadcrumb, CustomUpload, CustomDatePicker, StatusSelect, StyledTextL1 } from 'components/input'
import { formatDate, getStatus } from 'utils/index'
import { CLIENT_STATUS } from 'types/index'
import { BucketFile, Client, TBranch } from 'types/api'
import { UploadChangeParam } from 'antd/es/upload';
import clsx from 'clsx';
import { PlusIcon } from 'components/input';

const { Title } = Typography

export default function EditClient() {
    const { clientID } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm()
    const [clientStatus, setClientStatus] = useState<CLIENT_STATUS>()
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
    const [clientRecords, setClientRecords] = useState<Client.Record[]>([])

    const [editClient, { isLoading: editLoading }] = useUpdateClientMutation()
    const [addClientImage] = useAddClientImageMutation()
    const [deleteClientImage] = useDeleteClientImageMutation()
    const [createClientRecord] = useCreateClientRecordMutation()
    const [updateClientRecord] = useUpdateClientRecordMutation()
    const [deleteClientRecord] = useDeleteClientRecordMutation()

    const { data: client, isError } = useFetchClientQuery(clientID as string)
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})

    useEffect(() => {       
        if(isError) return;

        form.setFieldsValue({
            ...client,
            birth_date: dayjs(client?.birth_date),
            branch: (client?.branch as TBranch)?.id
        })
        
        setClientRecords(client?.customer_records?.map(record => ({
                ...record,
                birth_date: dayjs(record.birth_date)            
            })) 
            ?? []
        )
        setClientStatus(client?.status)

        if(client?.customer_images) {
            setImageFiles((client?.customer_images as BucketFile[]).map(file => ({
                uid: uuid(),
                response: file,
                status: 'done',
                name: 'image.png',
                url: file.image.file
            })))
        }
    }, [form, client, isError])

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

    function createRecord(record: Client.Record, index: number) {
        if((!record.full_name) || (!record.birth_date)) {
            toast.error("Пожалуйста, заполните поля")
            return;
        }
        createClientRecord({
            ...record,
            customer: client?.id,
            birth_date: (record?.birth_date as Dayjs)?.format(formatDate)
        })
        .unwrap()
        .then(response => {
            toast.success("Знакомый успешно добавлен")
            setClientRecords(prev => prev.map((record, idx) => {
                if(idx === index) {
                    return {
                        ...response,
                        birth_date: dayjs(response.birth_date)      
                    }
                } 
                return record
            }))
        })
        .catch(() => toast.error("Не удалось добавить знакомого"))
    }

    function editRecord(record: Client.Record, index: number) {
        if((!record.full_name) || (!record.birth_date)) {
            toast.error("Пожалуйста, заполните поля")
            return;
        }
        updateClientRecord({
            ...record,
            customer: client?.id,
            birth_date: (record?.birth_date as Dayjs)?.format(formatDate)
        })
        .unwrap()
        .then(response => {
            toast.success("Знакомый успешно изменен")
            setClientRecords(prev => prev.map((record, idx) => {
                if(idx === index) {
                    return {
                        ...response,
                        birth_date: dayjs(response.birth_date)      
                    }
                } 
                return record
            }))
        })
        .catch(() => toast.error("Не удалось изменить знакомого"))
    }

    function deleteRecord(record: Client.Record, index: number) {
        if(!record.id) {
            setClientRecords(prev => prev.filter((_, idx) => idx !== index))
            return;
        }
        deleteClientRecord(record.id)
            .unwrap()
            .then(() => {
                toast.success("Знакомый успешно удален")
                setClientRecords(prev => prev.filter((_, idx) => idx !== index))
            })        
    }

    // ------------- Image Upload -------------
    function changeImage(data: UploadChangeParam<UploadFile<any>>) {
        setImageFiles(data.fileList)

        if(data.file.status !== 'done') return;

        addClientImage({ 
            customer: parseInt(clientID as string, 10), 
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
                                
        return deleteClientImage({ id: data.response.id })
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
    const onFinish = (values: any) => {
        const data: Client.DTO = {
            ...client,
            ...values,
            status: clientStatus,
            birth_date: (values?.birth_date as Dayjs)?.format(formatDate),
            phone_number: _.replace(values.phone_number ?? '', /\D/g, '')
        }

        editClient(data)
            .unwrap()
            .then(() => {
                toast.success("Клиент успешно изменен")
                navigate(`/client/${clientID}/detail`)
            })
            .catch(() => toast.error("Не удалось изменить клиент"))
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Mijozlar', link: '/client' },
                    { title: client?.full_name ?? '-', link: `/client/${clientID}/detail` },
                    { title: 'Ma’lumotlarni o’zgartirish' }
                ]}
            />
            <Title level={3}>Ma’lumotlarni o’zgartirish</Title>
            <Form
                form={form}
                autoComplete="off"
                style={{ maxWidth: 1000 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[48, 0]}>
                    <Col span={12}>
                        <Row gutter={[0, 8]}>
                            <Col span={24}>
                                <div className='mt-05 mb-05'>
                                    <StyledTextL1>Mijoz statusi</StyledTextL1>
                                    <StatusSelect
                                        activeStatus={clientStatus}
                                        onSelectStatus={status => setClientStatus(status)}
                                        statuses={[
                                            {
                                                title: getStatus(CLIENT_STATUS.NEW, 'client'),
                                                value: CLIENT_STATUS.NEW,
                                            },
                                            {
                                                title: getStatus(CLIENT_STATUS.VIP, 'client'),
                                                value: CLIENT_STATUS.VIP,
                                            },
                                            {
                                                title: getStatus(CLIENT_STATUS.BLOCK, 'client'),
                                                value: CLIENT_STATUS.BLOCK,
                                            },
                                        ]} 
                                    /> 
                                </div>
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
                                    <Input size="large" min={12} max={13} placeholder='+99890 777 66 55'/>
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
                                    onChange={changeImage}
                                    onRemove={removeImage}
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
                                        {!el.id && (
                                            <Button size='middle' type='primary' onClick={() => createRecord(el, index)}>
                                                Qo’shish
                                            </Button>
                                        )}
                                        {el.id && (
                                            <Button size='middle' type='primary' onClick={() => editRecord(el, index)}>
                                                O’zgartirish
                                            </Button>
                                        )}
                                        <Button size='middle' onClick={() => deleteRecord(el, index)}>
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
                        <Button 
                            size='large' 
                            type='primary'
                            htmlType='submit'
                            loading={editLoading}
                        >
                            O’zgarishlarn saqlash
                        </Button>
                        <Button size='large' onClick={() => navigate(`/client/${clientID}/detail`)}>
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}

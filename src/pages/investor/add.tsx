/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { 
    Button, Col, Form, Input, 
    Row, Space, Typography, UploadFile 
} from 'antd'
import type { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';
import _ from 'lodash';
import { Investor } from 'types/api';
import { useFetchBranchesQuery } from 'services/branch';
import { useCreateInvestorMutation } from 'services/investor';
import { CustomBreadcrumb, CustomDatePicker, CustomSelect, CustomUpload } from 'components/input'
import { formatDate } from 'utils/index';

const { Title } = Typography

export default function AddInvestor() {
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [createInvestor, { isLoading: createLoading }] = useCreateInvestorMutation()
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})

    // ------------- Submit -------------
    const onFinish = (values: Investor.DTO) => {

        const data: Investor.DTO = {
            ...values,
            investor_images: imageFiles.map(file => file.response.id),
            birth_date: (values?.birth_date as Dayjs)?.format(formatDate),
            phone_number: _.replace(values.phone_number ?? '', /\D/g, '')
        }

        createInvestor(data)
            .unwrap()
            .then(() => {
                toast.success("Инвестор успешно создан")
                navigate('/investor/list')
            })
            .catch(() => toast.error("Не удалось создать инвестор"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Investorlar', link: '/investor/list' },
                    { title: 'Yangi mijoz qo’shish' },
                ]}
            />
            <Title level={3}>Yangi investor qo’shish</Title>
            <Form
                autoComplete="off"
                style={{ maxWidth: 460 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[0, 8]}>
                    <Col span={24}>
                        <Form.Item
                            name="full_name"
                            label="Investor ism-sharifi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos investorni ismini kiriting',
                                },
                            ]}
                        >
                            <Input size="large" placeholder='Ism-sharifi'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="phone_number"
                            label="Investor telefon raqami"
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
                            label="Investorning tug’ilgan yili"
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
                            label="Adress"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos adressni kiriting',
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
                                    message: 'Iltimos investorning pasportini kiriting',
                                },
                            ]}
                        >
                            <Input size="large" placeholder='AA 000 00 00'/>
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
                <div style={{ marginTop: '1rem' }}>
                    <Space size='large'>
                        <Button 
                            size='large' 
                            type='primary'
                            htmlType='submit'
                            loading={createLoading}
                        >
                            Investor qo’shish
                        </Button>
                        <Button size='large' onClick={() => navigate('/investor/list')}>
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}


/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography, UploadFile } from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { useCreateStaffMutation, useFetchBranchesQuery, useFetchStaffPositionsQuery } from 'services'
import { CustomSelect, CustomBreadcrumb, CustomUpload } from 'components/input'
import { Staff } from 'types/api'

const { Title } = Typography

export default function AddStaff() {
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [createStaff, { isLoading: createLoading }] = useCreateStaffMutation()
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})
    const { data: positions, isLoading: positionsLoading } = useFetchStaffPositionsQuery({})

    // ---------------- Submit ----------------
    const onFinish = (values: Staff.DTO) => {

        const data: Staff.DTO = {
            ...values,
            staff_images: imageFiles.map(file => file.response.id),
            phone_number: _.replace(values.phone_number ?? '', /\D/g, '')
        }

        createStaff(data)
            .unwrap()
            .then(() => {
                toast.success("Сотрудник успешно создан")
                navigate('/admin/staff/list')
            })
            .catch(() => toast.error("Не удалось создать сотрудник"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Ishchilar', link: '/admin/staff/list' },
                    { title: 'Yangi ishchi qo’shish' },
                ]}
            />
            <Title level={3}>Yangi ishchi qo’shish</Title>
            <Form
                autoComplete="off"
                style={{ maxWidth: 900 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Row gutter={[0, 8]}>
                            <Col span={24}>
                                <Form.Item
                                    name="full_name"
                                    label="Ishchi ism-sharifi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos ishchining ismini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Ism-sharifi'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="phone_number"
                                    label="Ishchi telefon raqami"
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
                                    name="address"
                                    label="Ishchi adressi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos ishchining adressini kiriting',
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
                                            message: 'Iltimos ishchining pasportini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='AA 000 00 00'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="position"
                                    label="Ishchi lavozimi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos ishchining lavozimini tanlang',
                                        },
                                    ]}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        placeholder='Tanlang'
                                        loading={positionsLoading}
                                        options={positions?.map(position => ({
                                            value: position.id,
                                            label: position.title
                                        }))}
                                    ></CustomSelect>
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
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row gutter={[0, 8]}>
                            <Col span={24}>
                                <Form.Item
                                    name="additional_information"
                                    label="Ishchi haqida ma’lumot"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input.TextArea
                                        showCount
                                        maxLength={100}
                                        style={{ height: 120 }}
                                        placeholder="Biror ma’lumot yozib qo’yish"
                                    />
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
                </Row>
                <div style={{ marginTop: '1rem' }}>
                    <Space size='large'>
                        <Button 
                            size='large' 
                            type='primary' 
                            htmlType='submit'
                            loading={createLoading}
                        >
                            Yangi ishchi qo’shish
                        </Button>
                        <Button size='large' onClick={() => navigate('/admin/staff/list')}>
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}
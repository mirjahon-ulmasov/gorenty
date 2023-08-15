/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography, UploadFile } from 'antd'
import _ from 'lodash';
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast';
import { 
    useAddStaffImageMutation, useDeleteStaffImageMutation, 
    useFetchStaffPositionsQuery, 
    useFetchStaffQuery, useUpdateStaffMutation 
} from 'services'
import { useFetchBranchesQuery } from 'services/branch'
import { CustomSelect, CustomBreadcrumb, CustomUpload } from 'components/input'
import { BucketFile, Staff, TBranch, TPosition } from 'types/api'
import { UploadChangeParam } from 'antd/es/upload';

const { Title } = Typography

export default function EditStaff() {
    const { staffID } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm()
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [editStaff, { isLoading: editLoading }] = useUpdateStaffMutation()
    const [addStaffImage] = useAddStaffImageMutation()
    const [deleteStaffImage] = useDeleteStaffImageMutation()
    const { data: staff, isError } = useFetchStaffQuery(staffID as string)
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})
    const { data: positions, isLoading: positionsLoading } = useFetchStaffPositionsQuery({})

    useEffect(() => {       
        if(isError) return;

        form.setFieldsValue({
            ...staff,
            position: (staff?.position as TPosition)?.id,
            branch: (staff?.branch as TBranch)?.id
        })
        if(staff?.staff_images) {
            setImageFiles((staff?.staff_images as BucketFile[]).map(file => ({
                uid: uuid(),
                response: file,
                status: 'done',
                name: 'image.png',
                url: file.image.file
            })))
        }
    }, [form, staff, isError])

    // ------------- Image Upload -------------
    function changeImage(data: UploadChangeParam<UploadFile<any>>) {
        setImageFiles(data.fileList)

        if(data.file.status !== 'done') return;

        addStaffImage({ 
            staff: parseInt(staffID as string, 10), 
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
                                
        return deleteStaffImage({ id: data.response.id })
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
        const data: Staff.DTO = {
            ...staff,
            ...values,
            phone_number: _.replace(values.phone_number ?? '', /\D/g, '')
        }

        editStaff(data)
            .unwrap()
            .then(() => {
                toast.success("Сотрудник успешно изменен")
                navigate(`/staff/${staffID}/detail`)
            })
            .catch(() => toast.error("Не удалось изменить сотрудник"))
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Ishchilar', link: '/staff/list' },
                    { title: staff?.full_name ?? '-', link: `/staff/${staffID}/detail` },
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
                                    <Input size="large" min={12} max={13} placeholder='+99890 777 66 55'/>
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
                                    onChange={changeImage}
                                    onRemove={removeImage} 
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
                            loading={editLoading}
                        >
                            O’zgarishlarn saqlash
                        </Button>
                        <Button size='large' onClick={() => navigate(`/staff/${staffID}/detail`)}>
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}

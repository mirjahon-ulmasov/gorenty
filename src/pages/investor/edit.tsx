/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography, UploadFile } from 'antd'
import toast from 'react-hot-toast';
import _ from 'lodash';
import { v4 as uuid } from 'uuid'
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CustomBreadcrumb, CustomDatePicker, CustomSelect, CustomUpload } from 'components/input'
import { useAddInvestorImageMutation, useDeleteInvestorImageMutation, useFetchInvestorQuery, useUpdateInvestorMutation } from 'services/investor';
import { useFetchBranchesQuery } from 'services/branch';
import { BucketFile, Investor, TBranch } from 'types/api';
import { UploadChangeParam } from 'antd/es/upload';
import { formatDate } from 'utils/index';

const { Title } = Typography

export default function EditInvestor() {
    const { investorID } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [editInvestor, { isLoading: editLoading }] = useUpdateInvestorMutation()
    const [addInvestorImage] = useAddInvestorImageMutation()
    const [deleteInvestorImage] = useDeleteInvestorImageMutation()
    const { data: investor, isError } = useFetchInvestorQuery(investorID as string)
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})

    useEffect(() => {       
        if(isError) return;

        form.setFieldsValue({
            ...investor,
            branch: (investor?.branch as TBranch)?.id,
            birth_date: investor?.birth_date && dayjs(investor.birth_date)
        })
        if(investor?.investor_images) {
            setImageFiles((investor.investor_images as BucketFile[]).map(file => ({
                uid: uuid(),
                response: file,
                status: 'done',
                name: 'image.png',
                url: file.image.file
            })))
        }
    }, [form, investor, isError])

    // ------------- Image Upload -------------
    function changeImage(data: UploadChangeParam<UploadFile<any>>) {
        setImageFiles(data.fileList)

        if(data.file.status !== 'done') return;

        addInvestorImage({ 
            investor: parseInt(investorID as string, 10), 
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
                                
        return deleteInvestorImage({ id: data.response.id })
            .unwrap()
            .then(() => {
                toast.success('Rasm muvafaqiyatli o’chirildi');
                return true;
            }).catch(() => {
                toast.error('Rasm o’chirilmadi');
                return false;
            })
    }

    // ------------- Submit -------------
    const onFinish = (values: any) => {
        const data: Investor.DTO = {
            ...investor,
            ...values,
            birth_date: (values?.birth_date as Dayjs)?.format(formatDate),
            phone_number: _.replace(values.phone_number ?? '', /\D/g, '')
        }

        editInvestor(data)
            .unwrap()
            .then(() => {
                toast.success("Инвестор успешно изменен")
                navigate(`/investor/${investorID}/detail`)
            })
            .catch(() => toast.error("Не удалось изменить инвестор"))
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Investorlar', link: '/investor/list' },
                    { title: investor?.full_name ?? '-', link: `/investor/${investorID}/detail` },
                    { title: 'Ma’lumotlarni o’zgartirish' },
                ]}
            />
            <Title level={3}>Ma’lumotlarni o’zgartirish</Title>
            <Form
                form={form}
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
                            <Input size="large" min={12} max={13} placeholder='+99890 777 66 55'/>
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
                            onChange={changeImage}
                            onRemove={removeImage}   
                        />
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
                            O’zgarishlarni saqlash
                        </Button>
                        <Button 
                            size='large' 
                            onClick={() => navigate(`/investor/${investorID}/detail`)}
                        >
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}

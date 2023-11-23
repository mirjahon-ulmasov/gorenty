/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { 
    Button, Col, Form, Input, InputNumber, 
    Row, Space, Typography 
} from 'antd'
import toast from 'react-hot-toast';
import _ from 'lodash';
import { Investor } from 'types/api';
import { 
    useCreateInvestorMutation, useFetchPaymentCategoriesQuery, 
    useFetchBranchesQuery 
} from 'services';
import { CustomBreadcrumb, CustomSelect, StatusSelect } from 'components/input'
import { PAYMENT_TYPE } from 'types/index';

const { Title } = Typography


export default function AddInOut() {
    const navigate = useNavigate();
    const [exchangeStatus, setExchangeStatus] = useState<PAYMENT_TYPE>(PAYMENT_TYPE.IN)

    const [createInvestor, { isLoading: createLoading }] = useCreateInvestorMutation()
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})
    const { data: paymentCategories, isLoading: paymentCategoriesLoading } = useFetchPaymentCategoriesQuery({})

    // ------------- Submit -------------
    const onFinish = (values: Investor.DTO) => {

        const data: Investor.DTO = {
            ...values,
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
                    { title: 'Kirim-chiqim', link: '/admin/in-out' },
                    { title: 'Kirim-chiqim qilish' },
                ]}
            />
            <Title level={3}>Kirim-chiqim qilish</Title>
            <Form
                autoComplete="off"
                style={{ maxWidth: 460, marginTop: '1rem' }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[0, 8]}>
                    <Col span={24}>
                        <StatusSelect
                            activeStatus={exchangeStatus}
                            onSelectStatus={status => setExchangeStatus(status)}
                            statuses={[
                                {
                                    title: "Kirim",
                                    value: PAYMENT_TYPE.IN,
                                },
                                {
                                    title: "Chiqim",
                                    value: PAYMENT_TYPE.OUT,
                                }
                            ]} 
                        /> 
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="payment_types"
                            label="To’lov turi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos to’lov turini tanlang',
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
                    <Col span={24}>
                        <Form.Item
                            name="sum"
                            label="Summa"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Iltimos summani kiriting' 
                                }
                            ]}
                        >
                            <InputNumber size="large" placeholder='Summani yozing'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="payment_category"
                            label="To’lov kategoriyasi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos to’lov kategoriyasi tanlang',
                                },
                            ]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                loading={paymentCategoriesLoading}
                                options={paymentCategories?.map(category => ({
                                    value: category.id,
                                    label: category.title
                                }))}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="staff"
                            label="Ishchi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos ishchini tanlang',
                                },
                            ]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                loading={paymentCategoriesLoading}
                                options={paymentCategories?.map(category => ({
                                    value: category.id,
                                    label: category.title
                                }))}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Zametka"
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
                </Row>
                <div style={{ marginTop: '1rem' }}>
                    <Space size='large'>
                        <Button 
                            size='large' 
                            type='primary'
                            htmlType='submit'
                            loading={createLoading}
                        >
                            Kirimni tasdiqlash
                        </Button>
                        <Button size='large' onClick={() => navigate('/admin/in-out/list')}>
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}


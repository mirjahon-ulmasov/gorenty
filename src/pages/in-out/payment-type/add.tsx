/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast';
import _ from 'lodash';
import { Investor } from 'types/api';
import { 
    useCreateInvestorMutation } from 'services';
import { CustomBreadcrumb, CustomSelect } from 'components/input'
import { getPaymentMethods } from 'utils/index';

const { Title } = Typography

export default function AddPaymentType() {
    const navigate = useNavigate();
    const [createInvestor, { isLoading: createLoading }] = useCreateInvestorMutation()

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
                    { title: 'Kirim-chiqim', link: '/admin/in-out/list' },
                    { title: 'To’lov turlari', link: '/admin/in-out/payment-type/list' },
                    { title: 'Yangi to’lov turi qo’shish' },
                ]}
            />
            <Title level={3}>Yangi to’lov turi qo’shish</Title>
            <Form
                autoComplete="off"
                style={{ maxWidth: 460, marginTop: '1rem' }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[0, 8]}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="To’lov turi nomi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Iltimos to’lov turini kiriting' 
                                }
                            ]}
                        >
                            <Input size="large" placeholder='To’lov turini nomlang'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="payment_methods"
                            label="To’lov usuli"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos to’lov usulini tanlang',
                                },
                            ]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                options={getPaymentMethods()}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="number"
                            label="Plastik karta raqami"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Iltimos karta raqamini kiriting' 
                                }
                            ]}
                        >
                            <Input size="large" placeholder='0000 0000 0000 0000'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="issue_date"
                            label="Plastik karta muddati"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Iltimos karta muddatini kiriting' 
                                }
                            ]}
                        >
                            <Input size="large" placeholder='00/00'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="owner"
                            label="Plastik karta egasi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Iltimos karta egasini kiriting' 
                                }
                            ]}
                        >
                            <Input size="large" placeholder='Kartadagi ism familiyani yozing'/>
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
                            Yangi to’lov turini qo’shish
                        </Button>
                        <Button size='large' onClick={() => navigate('/admin/in-out/payment-type/list')}>
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}


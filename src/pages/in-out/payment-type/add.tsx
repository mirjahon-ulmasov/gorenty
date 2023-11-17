import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast';
import _ from 'lodash';
import { CustomBreadcrumb, CustomSelect } from 'components/input'
import { useCreatePaymentMutation } from 'services';
import { getPaymentMethods } from 'utils/index';
import { PAYMENT_METHOD } from 'types/index';
import { Payment } from 'types/payment';

const { Title } = Typography

export default function AddPaymentType() {
    const navigate = useNavigate();
    const [form] = Form.useForm<Payment.DTOUpload>()
    const [paymentType, setPaymentType] = useState()
    const [createPayment, { isLoading: createLoading }] = useCreatePaymentMutation()

    // ------------- Submit -------------
    const onFinish = (values: Payment.DTOUpload) => {

        let data = values

        if(paymentType === PAYMENT_METHOD.CASH) {
            data = {...values, account: '', card_date: '', card_name: '', card_number: ''}
        }
        else if(paymentType === PAYMENT_METHOD.BANK) {
            data = {...values, card_date: '', card_name: '', card_number: ''}
        }
        else if(paymentType === PAYMENT_METHOD.CARD) {
            data = {...values, account: ''}
        }

        createPayment(data)
            .unwrap()
            .then(() => {
                toast.success("Платеж успешно добавлен")
                navigate('/admin/in-out/payment-type/list')
            })
            .catch(() => toast.error("Не удалось добавить платеж"))
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
                form={form}
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
                            name="state"
                            label="To’lov usuli"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos to’lov usulini tanlang' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                options={getPaymentMethods()}
                                value={paymentType}
                                onChange={(type) => setPaymentType(type)}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    {paymentType === PAYMENT_METHOD.CARD && (
                        <Fragment>
                            <Col span={24}>
                                <Form.Item
                                    name="card_number"
                                    label="Plastik karta raqami"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        { required: true, message: 'Iltimos karta raqamini kiriting' },
                                        { max: 16, min: 16, message: 'Karta 16ta raqamdan iborat bo’lishi kerak'}
                                    ]}

                                >
                                    <Input size="large" placeholder='8600 0000 0000 0000'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="card_date"
                                    label="Plastik karta muddati"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[{ required: true, message: 'Iltimos karta sanasini kiriting' }]}
                                >
                                    <Input size="large" placeholder='00/00'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="card_name"
                                    label="Plastik karta egasi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[{ required: true, message: 'Iltimos karta egasini kiriting' }]}
                                >
                                    <Input size="large" placeholder='Kartadagi ism familiyani yozing'/>
                                </Form.Item>
                            </Col>
                        </Fragment>
                    )}
                    {paymentType === PAYMENT_METHOD.BANK && (
                        <Col span={24}>
                            <Form.Item
                                name="account"
                                label="Bank hisob raqami"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: 'Iltimos karta raqamini kiriting' },
                                ]}

                            >
                                <Input size="large" placeholder='40702810038170000000'/>
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                <div style={{ marginTop: '2rem' }}>
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


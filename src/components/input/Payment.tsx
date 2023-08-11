import { Button, Col, Form, InputNumber, Input, Row, Space } from 'antd'
import { styled } from 'styled-components'
import clsx from 'clsx'
import { CustomSelect } from './Select'

interface PropTypes {    
    onClose: () => void
    note?: boolean
    amount?: boolean
    category?: boolean
    btnText?: string
}

export function Payment({ note = false, amount = true, category = true, btnText = 'Qo’shish', onClose }: PropTypes) {
    function closeHandler() {
        onClose()
    }

    const onFinish = (values: any) => {
        console.log('Success: ', values)
    }

    return (
        <PaymentContainer className={clsx('animate__animated', 'animate__fadeIn')}>
            <Form autoComplete="off" style={{ maxWidth: 450 }} onFinish={onFinish}>
                <Row gutter={[12, 8]} justify='space-between'>
                    {amount && (
                        <Col span={12}>
                            <Form.Item
                                name="amount"
                                label="Summani kiriting"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Iltimos summani kiriting',
                                    },
                                ]}
                            >
                                <InputNumber size="large" placeholder="100000" />
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={12}>
                        <Form.Item
                            name="payment_type"
                            label="To’lov turi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos to’lov turini kiriting',
                                },
                            ]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                options={[{ value: 'cash', label: 'Naqd' }]}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="filial"
                            label="Filial"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos filial tanlang',
                                },
                            ]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                options={[{ value: 'cash', label: 'Naqd' }]}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    {category && (
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="To’lov kategoriya"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Iltimos to’lov kategoriya tanlang',
                                    },
                                ]}
                            >
                                <CustomSelect
                                    allowClear
                                    size="large"
                                    placeholder='Tanlang'
                                    options={[{ value: 'cash', label: 'Naqd' }]}
                                ></CustomSelect>
                            </Form.Item>
                        </Col>
                    )}
                    {note && (
                        <Col span={24}>
                            <Form.Item
                                name="note"
                                label="Qayd"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[]}
                            >
                                <Input size="large" placeholder="Qayd matnini yozing" />
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={24} className='mt-1'>
                        <Space size="large">
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                            >
                                {btnText}
                            </Button>
                            <Button size="large" onClick={closeHandler}>
                                Bekor qilish
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </PaymentContainer>
    )
}

const PaymentContainer = styled.div`
    padding: 16px;
    max-width: 450px;
    border-radius: 8px;
    background: #fff3eb;
    border: 1px solid #ffbd99;
`

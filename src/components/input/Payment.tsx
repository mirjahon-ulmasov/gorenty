import { memo, useCallback, useState } from 'react'
import { Button, Col, Form, InputNumber, Input, Row, Space } from 'antd'
import { styled } from 'styled-components'
import clsx from 'clsx'
import { CustomSelect } from './Select'
import { useFetchBranchPaymentsQuery, useFetchBranchesQuery } from 'services'
import { PaymentLog } from 'types/branch-payment'
import { CustomUpload } from './FileUpload'
import { useAppSelector } from 'hooks/redux'
import { ID } from 'types/index'

interface PropTypes {    
    btnText?: string
    onClose: () => void
    onSubmit: (data: PaymentLog.DTOUpload) => void
}

export const Payment = memo((props: PropTypes) => {
    const { btnText = 'Qo’shish', onClose, onSubmit } = props
    const [state, setState] = useState<PaymentLog.DTO>({
        total: 0,
        branch: '',
        payment: '',
        payment_category: '',
        branch_payment_log_images: [],
        creator: '',
        description: ''
    })
    
    const { user } = useAppSelector(state => state.auth)
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})
    const { data: payments, isLoading: paymentsLoading } = useFetchBranchPaymentsQuery(
        { branch: state.branch },
        { skip: !state.branch }
    )    

    const changeState = useCallback((key: keyof PaymentLog.DTO, value: unknown) => {
        setState(prev => {
            if(!prev) return prev;
            return {
                ...prev,
                [key]: value
            }
        })
    }, [])    

    const onFinish = useCallback((values: any) => {
        const data: PaymentLog.DTOUpload = {
            ...state,
            ...values,
            creator: user?.id as ID,
            branch_payment_log_images: state.branch_payment_log_images
                .map(image => image.response?.id)
        }

        onSubmit(data)
    }, [onSubmit, state, user?.id])

    return (
        <PaymentContainer className={clsx('animate__animated', 'animate__fadeIn')}>
            <Form autoComplete="off" style={{ maxWidth: 450 }} onFinish={onFinish}>
                <Row gutter={[12, 8]} justify='space-between'>
                    <Col span={12}>
                        <Form.Item
                            name="total"
                            label="Summani kiriting"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos summani kiriting' }]}
                        >
                            <InputNumber size="large" placeholder="100000" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="payment_category"
                            label="To’lov kategoriya"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos to’lov kategoriya tanlang' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                options={[{ value: 1, label: 'Naqd' }]}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="branch"
                            label="Filial"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos filial tanlang' }]}
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
                                value={state?.branch}
                                onChange={el => changeState('branch', el)}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="payment"
                            label="To’lov turi"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos to’lov turini kiriting' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                loading={paymentsLoading}
                                options={payments?.map(el => ({
                                    value: el.payment.id,
                                    label: el.payment.title
                                }))}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Qayd"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.TextArea 
                                size="large" 
                                rows={3} 
                                placeholder="Qayd matnini yozing" 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='mt-1'>
                        <CustomUpload
                            fileList={state.branch_payment_log_images} 
                            onChange={(info) => changeState('branch_payment_log_images', info.fileList)}
                        />
                    </Col>
                    <Col span={24} className='mt-1'>
                        <Space size="large">
                            <Button type="primary" size="large" htmlType="submit">
                                {btnText}
                            </Button>
                            <Button size="large" onClick={onClose}>
                                Bekor qilish
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </PaymentContainer>
    )
})

const PaymentContainer = styled.div`
    padding: 16px;
    max-width: 450px;
    border-radius: 8px;
    background: #fff3eb;
    border: 1px solid #ffbd99;
`

import { memo, useCallback, useEffect, useState } from 'react'
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
    branch: ID
    btnText?: string
    onClose: () => void
    onSubmit: (data: PaymentLog.Branch) => void
}

interface StateType extends PaymentLog.DTOLocal {
    dest_branch: ID
    branch_payment: ID
}

export const BranchPayment = memo((props: PropTypes) => {
    const [form] = Form.useForm()
    const { btnText = 'Qo’shish', branch, onClose, onSubmit } = props
    const [state, setState] = useState<StateType>({
        total: 0,
        branch,
        payment: '',
        dest_branch: '',
        branch_payment: '',
        payment_category: '',
        branch_payment_log_images: [],
        creator: '',
        description: ''
    })
    
    const { user } = useAppSelector(state => state.auth)
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})
    const { data: sourcePayments, isLoading: sourcePaymentsLoading } = useFetchBranchPaymentsQuery(
        { branch: state.branch },
        { skip: !state.branch }
    )
    const { data: destPayments, isLoading: destPaymentsLoading } = useFetchBranchPaymentsQuery(
        { branch: state.dest_branch },
        { skip: !state.dest_branch }
    )

    useEffect(() => {
        setState(prev => ({ ...prev, branch_payment: '' }))
    }, [state.dest_branch])

    const changeState = useCallback((key: keyof StateType, value: unknown) => {
        setState(prev => ({ ...prev, [key]: value }))
    }, [])    

    const onFinish = useCallback(() => {
        const data: PaymentLog.Branch = {
            ...state,
            creator: user?.id as ID,
            branch_payment_log_images: state.branch_payment_log_images
                .map(image => image.response?.id)
        }        

        onSubmit(data)
    }, [onSubmit, state, user?.id])   

    return (
        <PaymentContainer className={clsx('animate__animated', 'animate__fadeIn')}>
            <Form autoComplete="off" style={{ maxWidth: 450 }} form={form} onFinish={onFinish}>
                <Row gutter={[12, 8]} justify='space-between'>
                    <Col span={12}>
                        <Form.Item
                            label="Summani kiriting"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos summani kiriting' }]}
                        >
                            <InputNumber 
                                size="large" 
                                placeholder="100000"
                                value={state.total}
                                onChange={number => changeState('total', number)} 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
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
                                value={state.payment_category || undefined}
                                onChange={el => changeState('payment_category', el)}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Filialga"
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
                                value={state.branch}
                                disabled
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="To’lov turiga"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos to’lov turini kiriting' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                loading={sourcePaymentsLoading}
                                options={sourcePayments?.map(el => ({
                                    value: el.payment.id,
                                    label: `${el.payment.title}: ${el.total?.toLocaleString()}`
                                }))}
                                value={state.payment || undefined}
                                onChange={el => changeState('payment', el)}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Filialdan"
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
                                value={state.dest_branch || undefined}
                                onChange={el => changeState('dest_branch', el)}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="To’lov turidan"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Iltimos to’lov turini kiriting' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder='Tanlang'
                                loading={destPaymentsLoading}
                                options={destPayments?.map(el => ({
                                    value: el.id,
                                    label: `${el.payment.title}: ${el.total?.toLocaleString()}`
                                }))}
                                value={state.branch_payment || undefined}
                                onChange={el => changeState('branch_payment', el)}
                            ></CustomSelect>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Qayd"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.TextArea 
                                rows={3} 
                                size="large" 
                                placeholder="Qayd matnini yozing"
                                value={state.description}
                                onChange={el => changeState('description', el.target.value)}
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

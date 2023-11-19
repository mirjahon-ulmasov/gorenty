import { ChangeEvent, useEffect, useState } from 'react'
import { Form, Button, Input, Typography, Row, Col, Space } from 'antd'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { CustomBreadcrumb } from 'components/input'
import { PlusIcon } from 'components/input'
import { PaymentCategory } from 'types/api'
import { 
    useCreatePaymentCategoryMutation, useFetchPaymentCategoriesQuery, 
    useUpdatePaymentCategoryMutation 
} from 'services'

const { Title } = Typography

export function PaymentCategoryPage() {
    const [state, setState] = useState<PaymentCategory.List>([])
    const [createPaymentCategory] = useCreatePaymentCategoryMutation()
    const [updatePaymentCategory] = useUpdatePaymentCategoryMutation()
    const { data: paymentCategories } = useFetchPaymentCategoriesQuery({})

    useEffect(() => {
        if(!paymentCategories) return;
        setState(paymentCategories)
    }, [paymentCategories])

    function addNew() {
        const filtered = state.filter(el => !el.id);
        
        if(filtered.length >= 1) {
            toast.error('Yangi kategoriyani qo’shing')
            return;
        }
        setState(prev => [{ title: '', originalTitle: '' }, ...prev])
    }

    function changeTitle(e: ChangeEvent<HTMLInputElement>, index: number) {
        setState(prev => prev.map((el, idx) => {
            if(idx === index) {
                return { ...el, title: e.target.value }
            }
            return el
        }))
    }

    function cancelState(index: number) {
        setState(prev => prev
            .filter((el) => el.title)
            .map((el, idx) => {
                if(idx === index) {
                    return { ...el, title: el.originalTitle }
                }
                return el
            })
        )
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'To’lov kategoriyalari', link: '/admin/payment-category' },
                    { title: 'To’lov kategoriyalari ro’yxati' },
                ]}
            />
            <Title level={3}>To'lov kategoriyalari ro’yxati</Title>
            <Form autoComplete="off" style={{ maxWidth: 460, marginTop: '2rem' }}>
                <Row gutter={[0, 24]}>
                    <Col span={24}>
                        <Button 
                            size='large' 
                            className='d-flex' 
                            icon={<PlusIcon />}
                            onClick={addNew}
                        >
                            Yangi kategoriya qo’shish
                        </Button>
                    </Col>
                    {state.map((el, index) => (
                        <Col span={24} key={index}>
                            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Input 
                                    size="large" 
                                    value={el.title} 
                                    onChange={e => changeTitle(e, index)} 
                                    placeholder='Kategoriya'
                                />
                            </Form.Item>
                            {!el.id && (
                                <Space className={clsx('mt-1', 'animate__animated', 'animate__fadeIn')}>
                                    <Button size='large' type='primary' onClick={() => createPaymentCategory(el)}>
                                        Qo’shish
                                    </Button>
                                    <Button size='large' onClick={() => cancelState(index)}>
                                        Bekor qilish
                                    </Button>
                                </Space>
                            )}
                            {(el.id && el.title && el.title !== el.originalTitle) && (
                                <Space className={clsx('mt-1', 'animate__animated', 'animate__fadeIn')}>
                                    <Button size='large' type='primary' onClick={() => updatePaymentCategory(el)}>
                                        O’zgarishni saqlash
                                    </Button>
                                    <Button size='large' onClick={() => cancelState(index)}>
                                        Bekor qilish
                                    </Button>
                                </Space>
                            )}
                        </Col>
                    ))}
                </Row>
            </Form>
        </>
    )
}

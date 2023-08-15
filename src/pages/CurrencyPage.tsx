import { ChangeEvent, useEffect, useState } from 'react'
import { 
    Form, Button, Input, Typography, 
    Row, Col, Space, InputNumber 
} from 'antd'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { CustomBreadcrumb } from 'components/input'
import { PlusIcon } from 'components/input'
import { Currency } from 'types/api'
import { 
    useCreateCurrencyMutation, useFetchCurrenciesQuery, 
    useUpdateCurrencyMutation 
} from 'services'

const { Title } = Typography

export function CurrencyPage() {
    const [state, setState] = useState<Currency.List>([])
    const [createCurrency] = useCreateCurrencyMutation()
    const [updateCurrency] = useUpdateCurrencyMutation()
    const { data: currencyList } = useFetchCurrenciesQuery({})

    useEffect(() => {
        if(!currencyList) return;
        setState(currencyList)
    }, [currencyList])

    function addNew() {
        const filtered = state.filter(el => !el.id);
        
        if(filtered.length >= 1) {
            toast.error('Yangi kategoriyani qo’shing')
            return;
        }
        setState(prev => [
            { ratio: 0, title: '', original: { title: '', ratio: 0} }, 
            ...prev
        ])
    }

    function changeTitle(e: ChangeEvent<HTMLInputElement>, index: number) {
        setState(prev => prev.map((el, idx) => {
            if(idx === index) {
                return { ...el, title: e.target.value }
            }
            return el
        }))
    }

    function changeRatio(value: number | null, index: number) {
        setState(prev => prev.map((el, idx) => {
            if(idx === index && value) {
                return { ...el, ratio: value }
            }
            return el
        }))
    }

    function cancelState(index: number) {
        setState(prev => prev
            .filter((el) => el.title || el.ratio)
            .map((el, idx) => {
                if(idx === index) {
                    return { 
                        ...el, 
                        title: el.original?.title, 
                        ratio: el.original?.ratio 
                    }
                }
                return el
            })
        )
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Valyuta', link: '/currency' },
                    { title: 'Valyutalar ro’yxati' },
                ]}
            />
            <Title level={3}>Valyuta</Title>
            <Form autoComplete="off" style={{ maxWidth: 460, marginTop: '2rem' }}>
                <Row gutter={[0, 24]}>
                    <Col span={24}>
                        <Button 
                            size='large' 
                            className='d-flex' 
                            icon={<PlusIcon />}
                            onClick={addNew}
                        >
                            Yangi valyuta qo’shish
                        </Button>
                    </Col>
                    {state.map((el, index) => (
                        <Col span={24} key={index}>
                            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Space size='middle'>
                                    <Input 
                                        name='title'
                                        size="large" 
                                        value={el.title} 
                                        onChange={e => changeTitle(e, index)} 
                                        placeholder='Valyutaning nomi'
                                    />
                                    =
                                    <InputNumber
                                        min={0}
                                        size="large" 
                                        placeholder='Qiymati'
                                        value={el.ratio}
                                        onChange={value => changeRatio(value, index)} 
                                    />
                                </Space>
                            </Form.Item>
                            {!el.id && (
                                <Space className={clsx('mt-1', 'animate__animated', 'animate__fadeIn')}>
                                    <Button size='large' type='primary' onClick={() => createCurrency(el)}>
                                        Qo’shish
                                    </Button>
                                    <Button size='large' onClick={() => cancelState(index)}>
                                        Bekor qilish
                                    </Button>
                                </Space>
                            )}
                            {(el.id && el.title && el.ratio && (el.title !== el.original?.title || el.ratio !== el.original?.ratio)) && (
                                <Space className={clsx('mt-1', 'animate__animated', 'animate__fadeIn')}>
                                    <Button size='large' type='primary' onClick={() => updateCurrency(el)}>
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

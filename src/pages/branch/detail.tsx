import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { 
    Button, Col, Row, Space, Typography, 
} from 'antd'
import toast from 'react-hot-toast';
import { 
    CustomBreadcrumb, Label, StyledTextL1, 
    StyledTextL2, BorderBox, SmallImg,
    MinusIcon, PlusIcon, BranchPayment
} from 'components/input'
import { 
    useBranchIncomeMutation, useBranchOutcomeMutation, 
    useFetchBranchQuery, useFetchPaymentLogsQuery 
} from 'services';
import { PaymentLog } from 'types/branch-payment';
import { ID, TRANSACTION } from 'types/index';
import { formatPhone } from 'utils/index';
import { BucketFile } from 'types/api'

const { Title } = Typography

export default function CarDetail() {
    const navigate = useNavigate()
    const { branchID } = useParams()
    const [transactionType, setTransactionType] = useState<TRANSACTION>();

    const { data: branch } = useFetchBranchQuery(branchID as string)
    const { data: paymentLogs } = useFetchPaymentLogsQuery({
        branch: branchID
    })

    const [branchIncome] = useBranchIncomeMutation()
    const [branchOutcome] = useBranchOutcomeMutation()
    
    const makeTransaction = useCallback((data: PaymentLog.Branch) => {
        if(transactionType === TRANSACTION.INCOME) {
            branchIncome(data).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Баланс пополнен")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        } else {
            branchOutcome(data).unwrap()
                .then(() => {
                    setTransactionType(undefined)
                    toast.success("Списано с баланса")
                })
                .catch(() => toast.error("Что-то пошло не так"))
        }
    }, [branchIncome, branchOutcome, transactionType])    


    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Filiallar', link: '/admin/branch/list' },
                    { title: branch?.title ?? '-' },
                ]}
            />
            <Row gutter={[48, 24]}>
                <Col span={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div className='d-flex jc-sb'>  
                                <Title level={3}>{branch?.title ?? '-'}</Title>
                                <Space size="small">
                                    <Button
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/admin/branch/'.concat(
                                                    branchID?.toString() as string,
                                                    '/payment'
                                                )
                                            )
                                        }
                                    >
                                        Hisoblar
                                    </Button>
                                    <Button
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/admin/branch/'.concat(
                                                    branchID?.toString() as string,
                                                    '/edit'
                                                )
                                            )
                                        }
                                    >
                                        O’zgartirish
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[12, 12]}>
                                <Col span={24}>
                                    <Label>Filialdagi kassa</Label>
                                </Col>
                                <Col span={24} className='mt-05'>
                                    <StyledTextL2 fs={38}>78 000 000 so’m</StyledTextL2>
                                </Col>
                                <Col span={24} className='mt-05'>
                                    <Space>
                                        <Button 
                                            size="middle" 
                                            className="d-flex"
                                            icon={<PlusIcon />}
                                            onClick={() => setTransactionType(TRANSACTION.INCOME)} 
                                        >
                                            Kirim qilish
                                        </Button>
                                        <Button 
                                            size="middle" 
                                            className="d-flex"
                                            icon={<MinusIcon />}
                                            onClick={() => setTransactionType(TRANSACTION.OUTCOME)}
                                        >
                                            Chiqim qilish
                                        </Button>
                                    </Space>
                                </Col>
                                {transactionType && (
                                    <Col span={24}>
                                        <BranchPayment
                                            branch={branch?.id as ID}
                                            onClose={() => setTransactionType(undefined)} 
                                            onSubmit={(data) => makeTransaction(data)}
                                            btnText={transactionType === TRANSACTION.INCOME ? 'Kirim' : 'Chiqim'}
                                        />
                                    </Col>
                                )}
                                <Col span={24} className='mt-1'>
                                    <Label>Aktiv pullar</Label>
                                </Col>
                                <Col span={24}>
                                    <ul className='d-flex fd-col gap-8 p-8'>
                                        {[1,2,3,4,5].map((_el, index) => (
                                            <li className='d-flex jc-sb w-100' key={index}>
                                                <StyledTextL1 fs={16}>Naqd</StyledTextL1>
                                                <StyledTextL1 fs={16}>30 000 000 so’m</StyledTextL1>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col span={24} className='mt-1'>
                                    <Label>Band pullar</Label>
                                </Col>
                                <Col span={24}>
                                    <ul className='d-flex fd-col gap-8 p-8'>
                                        {[1,2,3,4,5].map((_el, index) => (
                                            <li className='d-flex jc-sb w-100' key={index}>
                                                <StyledTextL1 fs={16}>Naqd</StyledTextL1>
                                                <StyledTextL1 fs={16}>30 000 000 so’m</StyledTextL1>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            <Label>Filial ma’lumotlari</Label>
                        </Col>
                        <Col span={24}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Telefon</StyledTextL1>
                                <StyledTextL2>{formatPhone(branch?.phone_number ?? '-')}</StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={24}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Manzil</StyledTextL1>
                                <StyledTextL2>{branch?.address ?? '-'}</StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={12}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Ma’sul shaxs</StyledTextL1>
                                <StyledTextL2>{branch?.attached_person_full_name ?? '-'}</StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={12}>
                            <BorderBox className='fd-col'>
                                <StyledTextL1>Telefon raqami</StyledTextL1>
                                <StyledTextL2>
                                    {formatPhone(branch?.attached_person_phone_number ?? '-')}
                                </StyledTextL2>
                            </BorderBox>
                        </Col>
                        <Col span={24}>
                            <BorderBox className='fd-col' p='24px' bg='rgba(27, 16, 5, 0.02)'>
                                <StyledTextL2 fs={18}>Qo’shimcha ma’lumot</StyledTextL2>
                                <StyledTextL1 fs={16}>{branch?.description ?? '-'}</StyledTextL1>
                            </BorderBox>
                        </Col>
                        {(branch?.branch_images && branch.branch_images.length > 0) && (
                            <Col span={24}>
                                <BorderBox className='d-flex jc-start fw-wrap gap-12'>
                                    {(branch.branch_images as BucketFile[])?.map((el) => (
                                        <SmallImg 
                                            width={90} 
                                            height={90} 
                                            key={el.id} 
                                            src={el.image.file} 
                                            alt='Branch' 
                                        />
                                    ))}
                                </BorderBox>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    )
}
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Space, Typography } from "antd";
import { 
    BorderBox, Card, CustomBreadcrumb, CustomSelect, 
    PlusIcon, StyledTextL1, StyledTextL2 
} from "components/input";
import { 
    useFetchPaymentsQuery, useCreateBranchPaymentMutation, 
    useFetchBranchPaymentsQuery 
} from "services";
import { BranchPayment } from "types/branch-payment";
import { formatCardNumber } from "utils/index";
import { ID } from "types/index";

const { Title } = Typography

export default function BranchPayments() {
    const { branchID } = useParams()
    const [addNewPayment, setAddNewPayment] = useState(false)
    const [state, setState] = useState<BranchPayment.DTOUpload>({
        branch: branchID as ID,
        payment: ''
    })
    const { data: payments, isLoading: loadingPayments } = useFetchPaymentsQuery()
    const { data: branchPayments } = useFetchBranchPaymentsQuery({
        branch: branchID
    });
    const [createBranchPayment, { isLoading: createLoading }] = useCreateBranchPaymentMutation()

    function cancelState() {
        setState(prev => ({ ...prev, payment: '' }))
        setAddNewPayment(false)
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Filiallar', link: '/admin/branch/list' },
                ]}
            />
            <Title level={3}>Hisoblar</Title>
            <Button
                size="large"
                className='d-flex mt-1' 
                icon={<PlusIcon />}
                onClick={() => setAddNewPayment(true)}
            >
                Yangi hisob qo’shish
            </Button>
            {addNewPayment && (
                <BorderBox className="fd-col gap-16 mt-1 w-500">
                    <CustomSelect
                        allowClear
                        size="large"
                        placeholder='Tanlang'
                        loading={loadingPayments}
                        options={payments?.map(payment => ({
                            value: payment.id,
                            label: payment.title
                        }))}
                        value={state.payment || undefined}
                        onChange={payment => setState(prev => ({...prev, payment}))}
                    ></CustomSelect>
                    <Space>
                        <Button 
                            size='large' 
                            type='primary' 
                            loading={createLoading}
                            onClick={() => createBranchPayment(state)}
                        >
                            Qo’shish
                        </Button>
                        <Button size='large' onClick={cancelState}>
                            Bekor qilish
                        </Button>
                    </Space>
                </BorderBox>
            )}
            <div className="d-flex fd-col ai-start gap-16 mt-1">
                {branchPayments?.map((payment, index) => (
                    <Card key={index} w={500} p="32px">
                        <StyledTextL2 fs={18}>{payment.payment.title}</StyledTextL2>
                        {payment.payment.account && (
                            <StyledTextL1 fs={16}>{payment.payment.account}</StyledTextL1>
                        )}
                        {payment.payment.card_number && (
                            <StyledTextL1 fs={16}>{formatCardNumber(payment.payment.card_number)}</StyledTextL1>
                        )}
                        {payment.payment.card_name && (
                            <StyledTextL1 fs={16}>{payment.payment.card_name}</StyledTextL1>
                        )}
                        {payment.payment.card_date && (
                            <StyledTextL1 fs={16}>{payment.payment.card_date}</StyledTextL1>
                        )}
                        <StyledTextL2 fs={16}>Balans: {payment.total} so’m</StyledTextL2>
                    </Card>
                ))}
            </div>
        </>
    )
}

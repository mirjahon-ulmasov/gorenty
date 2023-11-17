import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { 
    Card, CustomBreadcrumb, PlusIcon, 
    StyledLink, StyledTextL1, StyledTextL2 
} from "components/input";
import { useFetchPaymentsQuery } from "services/payment";
import { formatCardNumber } from "utils/index";

const { Title } = Typography

export default function PaymentTypes() {
    const { data: payments } = useFetchPaymentsQuery();
    const navigate = useNavigate()

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Kirim-chiqim', link: '/admin/in-out' },
                    { title: 'To’lov turlari' },
                ]}
            />
            <Title level={3}>To’lov turlari</Title>
            <Button
                size="large"
                icon={<PlusIcon />}
                className='d-flex mt-1' 
                onClick={() => navigate('/admin/in-out/payment-type/add')} 
            >
                Yangi to’lov turi qo’shish
            </Button>
            <div className="d-flex fd-col ai-start gap-16 mt-2">
                {payments?.map((payment, index) => (
                    <Card key={index} w={500} p="32px">
                        <StyledTextL2 fs={18}>{payment.title}</StyledTextL2>
                        {payment.account && (
                            <StyledTextL1 fs={16}>{payment.account}</StyledTextL1>
                        )}
                        {payment.card_number && (
                            <StyledTextL1 fs={16}>{formatCardNumber(payment.card_number)}</StyledTextL1>
                        )}
                        {payment.card_name && (
                            <StyledTextL1 fs={16}>{payment.card_name}</StyledTextL1>
                        )}
                        {payment.card_date && (
                            <StyledTextL1 fs={16}>{payment.card_date}</StyledTextL1>
                        )}
                        <StyledLink 
                            underline={1} 
                            color="var(--black-65)" 
                            to={`/admin/in-out/payment-type/${payment.id}/edit`}
                        >
                            O’zgartirish
                        </StyledLink>
                    </Card>
                ))}
            </div>
        </>
    )
}

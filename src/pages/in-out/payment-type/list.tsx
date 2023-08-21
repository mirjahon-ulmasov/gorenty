import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { 
    Card, CustomBreadcrumb, PlusIcon, 
    StyledLink, StyledTextL1, StyledTextL2 
} from "components/input";
import data from "./data.json"

const { Title } = Typography

export default function PaymentTypes() {
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
                {data.map((payment, index) => (
                    <Card key={index} w={500} p="32px">
                        <StyledTextL2 fs={18}>{payment.title}</StyledTextL2>
                        <StyledTextL1 fs={16}>{payment.number}</StyledTextL1>
                        {payment.owner && (
                            <StyledTextL1 fs={16}>{payment.owner}</StyledTextL1>
                        )}
                        {payment.issue_date && (
                            <StyledTextL1 fs={16}>{payment.issue_date}</StyledTextL1>
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

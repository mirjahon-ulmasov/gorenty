import { Col, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
    Card, RGPSIcon, RIncomeIcon, RInsuranceIcon, 
    ROilIcon, ROrderIcon, ROutgoingsIcon, 
    RToningIcon, RUserIcon, StyledTextL2 
} from 'components/input'

const { Title } = Typography

export default function Menu() {
    const navigate = useNavigate()

    return (
        <Row className='d-flex fd-col ai-start'>
            <Col>
                <Title level={3}>Moliyaviy hisobotlar</Title>
            </Col>
            <Col>
                <div className="d-flex fw-wrap jc-start gap-24 mt-2" style={{ maxWidth: 1100 }}>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("orders")}>
                        <ROrderIcon />
                        <StyledTextL2>Buyurtmalar soni</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("incomes")}>
                        <RIncomeIcon />
                        <StyledTextL2>Daromad</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("toning")}>
                        <RToningIcon />
                        <StyledTextL2>Tonirovka</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("insurance")}>
                        <RInsuranceIcon />
                        <StyledTextL2>Sug’urta</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("oil")}>
                        <ROilIcon />
                        <StyledTextL2>Moy</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("outgoings")}>
                        <ROutgoingsIcon />
                        <StyledTextL2>Chiqim/harajat</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("users")}>
                        <RUserIcon />
                        <StyledTextL2>Gorentyga qo’shilganlar</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("gps")}>
                        <RGPSIcon />
                        <StyledTextL2>GPS otchet</StyledTextL2>
                    </Card>
                </div>
            </Col>
        </Row>
    )
}

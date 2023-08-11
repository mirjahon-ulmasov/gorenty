import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Typography, Divider } from 'antd'
import { useFetchBranchesQuery } from 'services'
import { PlusIcon } from 'assets/images/Icons'
import styled from 'styled-components'
import { StyledTextL1, StyledTextL2 } from 'components/input'

const { Title } = Typography

export default function Branches() {
    const navigate = useNavigate()
    const { data: branches } = useFetchBranchesQuery({})

    function navigateToDetail(id: unknown) {
        navigate('/branch/'.concat((id as number).toString(), '/detail'))
    }

    function navigateToOrders(event: React.MouseEvent<HTMLElement, MouseEvent>, id: unknown) {
        event.stopPropagation()
        navigate('/order/list', { state: { type: 'branch', id }})
    }

    return (
        <>
            <Row justify="space-between" style={{ marginBottom: '2rem' }}>
                <Col>
                    <Title level={3}>Filiallar</Title>
                </Col>
                <Col>
                    <Button icon={<PlusIcon />} className="d-flex" onClick={() => navigate('/branch/add')}>
                        Yangi filial qo’shish
                    </Button>
                </Col>
            </Row>
            <div className='d-flex fw-wrap jc-start gap-16 mt-2'>
                {branches?.map(branch => (
                    <BranchCard key={branch.id} onClick={() => navigateToDetail(branch.id)}>
                        <StyledTextL2 fs={20}>{branch.title}</StyledTextL2>
                        <StyledTextL1>Tel: {branch.phone_number}</StyledTextL1>
                        <Divider style={{ margin: '10px 0px', borderColor: '#FFBD99' }} dashed />
                        <StyledTextL1>Joriy kassa: 500 000 000 so’m</StyledTextL1>
                        <Button className='mt-1' onClick={(e) => navigateToOrders(e, branch.id)}>
                            Aktiv buyurtmalar
                        </Button>
                    </BranchCard>
                ))}
            </div>
        </>
    )
}

const BranchCard = styled.div`
    width: 300px;
    padding: 24px 32px;
    display: flex;
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 16px;
    background: #FFF3EB;
    transition: 0.2s ease-in;

    &:hover {
        background: #FFD9C2;
    }
`
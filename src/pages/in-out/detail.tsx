import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Typography } from "antd";
import styled from "styled-components";
import { BorderBox, CustomBreadcrumb, Label, StyledTextL1, StyledTextL2 } from "components/input";

const { Title } = Typography

export default function InOutDetail() {
    const { inOutID } = useParams()
    const navigate = useNavigate()
    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Kirim-chiqim', link: '/admin/in-out' },
                    { title: 'K-345654' },
                ]}
            />
            <div className="d-flex jc-sb w-500">
                <Title level={3}>Kirim ma’lumotlari</Title>
                <Button size='large' onClick={() => navigate(`/admin/in-out/${inOutID}/edit`)}>
                    O’zgartirish
                </Button>
            </div>
            <div className="d-flex jc-sb w-500 mt-1">
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <Status><StyledTextL2>Remont</StyledTextL2></Status>
                    </Col>
                    <Col span={24} className="mt-1">
                        <StyledTextL2 fs={38}>78 000 000 so’m</StyledTextL2>
                    </Col>
                    <Col span={24} className="mt-1">
                        <Label>Ma’lumotlari</Label>
                    </Col>
                    <Col span={24}>
                        <BorderBox className='fd-col'>
                            <StyledTextL1>Kirim-chiqim turi</StyledTextL1>
                            <StyledTextL2>Naqd</StyledTextL2>
                        </BorderBox>
                    </Col>
                    <Col span={12}>
                        <BorderBox className='fd-col'>
                            <StyledTextL1>Ochilgan sana</StyledTextL1>
                            <StyledTextL2>11:32 , 12-mart, 2023-yil</StyledTextL2>
                        </BorderBox>
                    </Col>
                    <Col span={12}>
                        <BorderBox className='fd-col'>
                            <StyledTextL1>Qo’shilgan filial</StyledTextL1>
                            <StyledTextL2>Sergeli</StyledTextL2>
                        </BorderBox>
                    </Col>
                    <Col span={24} className="mt-1">
                        <BorderBox className='fd-col' p='24px' bg='rgba(27, 16, 5, 0.02)'>
                            <StyledTextL2 fs={18}>Zametka</StyledTextL2>
                            <StyledTextL1 fs={16}>Ofisni remontiga pul kiritdik</StyledTextL1>
                        </BorderBox>
                    </Col>
                </Row>
            </div>
        </>
    )
}

const Status = styled.span`
    border-radius: 4px;
    padding: 10px 16px;
    background: #8EE6B4;
`
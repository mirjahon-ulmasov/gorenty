import { Col, Divider, Row, Typography } from "antd"
import styled from "styled-components"
import { StyledText } from "components/input"

const { Title } = Typography

const data = {
    results: [
        {
            plate_number: '01 RR 002 I',
            notification: 'Su’g’urta muddati tugashiga 10 kun qoldi',
            is_viewed: false
        },
        {
            plate_number: '01 BB 221 A',
            notification: 'Tonirovka muddati tugashiga 10 kun qoldi',
            is_viewed: false
        },
        {
            plate_number: '01 WW 122 V',
            notification: 'Su’g’urta muddati tugashiga 5 kun qoldi',
            is_viewed: true
        },
        {
            plate_number: '01 RR 002 I',
            notification: 'Su’g’urta muddati tugashiga 10 kun qoldi',
            is_viewed: true
        }
    ]
}


export function NotificationsPage() {
    return (
        <>
            <Title level={3}>Xabarlar</Title>
            <Row className="w-100 mt-2">
                {data.results.map((el, index) => (
                    <Col span={24} key={index}>
                        <Row wrap={false} align='middle'>
                            <Col flex="120px">
                                <StyledText 
                                    underline color={el.is_viewed ? 'var(--black-65)' : 'var(--black-88)'}
                                >
                                    {el.plate_number}
                                </StyledText>
                            </Col>
                            <Col flex="auto">
                                <StyledText
                                    fw={el.is_viewed ? 400 : 500}
                                    color={el.is_viewed ? 'var(--black-65)' : 'var(--black-88)'}
                                >
                                    {el.notification}
                                </StyledText>
                            </Col>
                            {!el.is_viewed && (
                                <Col flex="15px"><Dot /></Col>
                            )}
                        </Row>
                        <Divider style={{ margin: '20px 0'}}/>
                    </Col>
                ))}
            </Row>
        </>
    )
}

const Dot = styled.div`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #FF561F;    
`

import { useNavigate, useParams } from 'react-router-dom'
import { 
    Button, Col, Row, Space, Typography, 
} from 'antd'
import { 
    CustomBreadcrumb, Label, StyledTextL1, 
    StyledTextL2, BorderBox, SmallImg 
} from 'components/input'
import { useFetchBranchQuery } from 'services/branch';
import { BucketFile } from 'types/api'
import { MinusIcon, PlusIcon } from 'components/input'
import { formatPhone } from 'utils/index';

const { Title } = Typography

export default function CarDetail() {
    const navigate = useNavigate()
    const { branchID } = useParams()

    const { data: branch } = useFetchBranchQuery(branchID as string)

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
                                            icon={<PlusIcon />} 
                                            className="d-flex"
                                        >
                                            Kirim qilish
                                        </Button>
                                        <Button 
                                            size="middle" 
                                            icon={<MinusIcon />} 
                                            className="d-flex"
                                        >
                                            Chiqim qilish
                                        </Button>
                                    </Space>
                                </Col>
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
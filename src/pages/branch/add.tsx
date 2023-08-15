/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { 
    Button, Col, Row, Form, Input, 
    Space, Typography, UploadFile
} from 'antd'
import { CustomBreadcrumb, CustomUpload } from 'components/input'
import { useCreateBranchMutation } from 'services';
import { Branch } from 'types/api';

const { Title } = Typography

export default function AddBranch() {
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [createBranch, { isLoading: createLoading }] = useCreateBranchMutation()

    // ---------------- Submit ----------------
    const onFinish = (values: Branch.DTO) => {

        const data: Branch.DTO = {
            ...values,
            branch_images: imageFiles.map(file => file.response.id),
        }    

        createBranch(data)
            .unwrap()
            .then(() => {
                toast.success("Филиал успешно создан")
                navigate('/branch/list')
            })
            .catch(() => toast.error("Не удалось создать филиал"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Filiallar', link: '/branch/list' },
                    { title: 'Yangi filial qo’shish' },
                ]}
            />
            <Title level={3}>Yangi filial qo’shish</Title>
            <Form
                autoComplete="off"
                style={{ maxWidth: 900, marginTop: 20 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Row gutter={[24, 8]}>
                            <Col span={24}>
                                <Form.Item
                                    name="title"
                                    label="Filial nomi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos filial nomini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Filial nomini kiriting'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="phone_number"
                                    label="Filial telefon raqamli"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        { required: true, message: 'Iltimos telefon raqam kiriting' },
                                        { max: 13, message: 'Telefon raqam 13tadan oshmasligi kerak' },
                                        { min: 12, message: 'Telefon raqam 12tadan kam bo’lmasligi kerak' },
                                    ]}
                                >
                                    <Input size="large" placeholder='+99890 777 66 55'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="address"
                                    label="Filial adressi"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos filial adressini kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='17 uy, Chilonzor tumani, Tashkent'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="attached_person_full_name"
                                    label="Ma’sul shaxs"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Iltimos ma’sul shaxsni kiriting',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder='Ma’sul shaxs ismi-sharifi'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="attached_person_phone_number"
                                    label="Ma’sul shaxs telefon raqami "
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[
                                        { required: true, message: 'Iltimos telefon raqam kiriting' }
                                    ]}
                                >
                                    <Input size="large" placeholder='Telefon raqam'/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row gutter={[24, 8]}>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Filial haqida ma’lumot"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input.TextArea
                                        showCount
                                        maxLength={100}
                                        style={{ height: 120 }}
                                        placeholder="Biror ma’lumot yozib qo’yish"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} className='mt-1'>
                                <CustomUpload 
                                    fileList={imageFiles} 
                                    onChange={(info) => setImageFiles(info.fileList)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div style={{ marginTop: 30 }}>
                    <Space size='large'>
                        <Button 
                            size='large' 
                            type='primary'
                            htmlType='submit'
                            loading={createLoading}
                        >
                            Yangi filial ochish
                        </Button>
                        <Button size='large' onClick={() => navigate('/branch/list')}>
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}

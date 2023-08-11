/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast';
import { 
    Button, Col, Row,
    Form, Input, Space, 
    Typography, UploadFile
} from 'antd'
import { v4 as uuid } from 'uuid'
import { UploadChangeParam } from 'antd/es/upload';
import { CustomBreadcrumb, CustomUpload } from 'components/input'
import { BucketFile, Branch } from 'types/api';
import { 
    useAddBranchImageMutation, useDeleteBranchImageMutation, 
    useFetchBranchQuery, useUpdateBranchMutation 
} from 'services';

const { Title } = Typography

export default function EditBranch() {
    const { branchID } = useParams();
    const navigate = useNavigate();
    
    const [form] = Form.useForm()
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [editBranch] = useUpdateBranchMutation()
    const [addBranchImage] = useAddBranchImageMutation()
    const [deleteBranchImage] = useDeleteBranchImageMutation()
    const { data: branch, isError } = useFetchBranchQuery(branchID as string)

    useEffect(() => {       
        if(isError) return;
        
        form.setFieldsValue(branch)

        if(branch?.branch_images) {
            setImageFiles((branch?.branch_images as BucketFile[]).map(file => ({
                uid: uuid(),
                response: file,
                status: 'done',
                name: 'image.png',
                url: file.image.file
            })))
        }
    }, [form, branch, isError])    

    // ------------- Image Upload -------------
    function changeImage(data: UploadChangeParam<UploadFile<any>>) {
        setImageFiles(data.fileList)

        if(data.file.status !== 'done') return;

        addBranchImage({ 
            branch: parseInt(branchID as string, 10), 
            image: data.file.response.id 
        })
            .unwrap()
            .then((response) => {
                setImageFiles(prev => prev.map(file => {
                    if(file.response.id === response.image) {
                        return {
                            ...file,
                            response
                        }
                    }
                    return file
                }))                                        
            })
            .catch(() => toast.error('Rasm yuklanmadi'))
    }

    function removeImage(data: UploadFile<any>) {
        if(!data.response.id) return true
                                
        return deleteBranchImage({ id: data.response.id })
            .unwrap()
            .then(() => {
                toast.success('Rasm muvafaqiyatli o’chirildi');
                return true;
            }).catch(() => {
                toast.error('Rasm o’chirilmadi');
                return false;
            })
    }

    // ---------------- Submit ----------------
    const onFinish = (values: Branch.DTO) => {     
                
        const data: Branch.DTO = {
            ...branch,
            ...values
        }    

        editBranch(data)
            .unwrap()
            .then(() => {
                toast.success("Филиал успешно изменен")
                navigate('/branch/list')
            })
            .catch(() => toast.error("Не удалось изменить филиал"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo);
    }

    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Filiallar', link: '/branch/list' },
                    { title: branch?.title ?? '-', link: `/branch/${branchID}/detail` },
                    { title: 'Ma’lumotlarni o’zgartirish' },
                ]}
            />
            <Title level={3}>Ma’lumotlarni o’zgartirish</Title>
            <Form
                form={form}
                autoComplete="off"
                style={{ maxWidth: 1100, marginTop: 20 }}
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
                                    onChange={changeImage}
                                    onRemove={removeImage}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div style={{ marginTop: 30 }}>
                    <Space size='large'>
                        <Button type='primary' size='large' htmlType='submit'>O’zgarishlarn saqlash</Button>
                        <Button size='large' onClick={() => navigate(`/branch/${branchID}/detail`)} >
                            Bekor qilish
                        </Button>
                    </Space>
                </div>
            </Form>
        </>
    )
}


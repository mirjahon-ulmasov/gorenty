import { useState } from 'react'
import { useAppSelector } from 'hooks/redux'
import { Modal, Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { API_BASE_URL } from 'services/baseQuery'

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })

interface CustomUploadProps extends UploadProps {
    fileList?: UploadFile<any>[];
    loading?: boolean
}
      

export function CustomUpload(props: CustomUploadProps) {
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    const { access_token } = useAppSelector(state => state.auth)

    const handleCancel = () => setPreviewOpen(false)

    const exProps: UploadProps = {
        name: 'file',
        method: 'POST',
        action: API_BASE_URL + '/file/',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        async onPreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj as RcFile)
            }

            setPreviewImage(file.url || (file.preview as string))
            setPreviewOpen(true)
        },
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload {...exProps} {...props} progress={{ showInfo: true }} listType="picture-card">
                {(props.fileList?.length || 0) >= 8 ? null : (
                    uploadButton
                )}
            </Upload>
            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    src={previewImage}
                    style={{ width: '100%' }}
                />
            </Modal>
        </>
    )
}
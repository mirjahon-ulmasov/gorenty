import { Select, SelectProps } from 'antd'
import { SelectArrowIcon } from 'components/input'

export const CustomSelect = (props: SelectProps) => {
    return <Select suffixIcon={<SelectArrowIcon />} {...props} />
}

// <CustomSelect
//     showSearch
//     allowClear
//     value={client}
//     onChange={changeClient}
//     onSearch={searchClient}
//     size='large'
//     style={{ maxWidth: 320 }}
//     placeholder="Mijozni tanlang"
//     optionFilterProp="children"
//     filterOption={(input, option) =>
//         (option?.label ?? '').toString().toLowerCase().includtoLowerCase())
//     }
//     filterSort={(optionA, optionB) =>
//         (optionA?.label ?? '').toString().toLowerCase().loca((optionB?.label ?? '').toString().toLowerCase())
//     }
//     loading={clientsLoading}
//     options={clients?.results?.map((client) => (
//         {
//             value: client.id,
//             label: client.full_name,
//         })) || []
//     }
// />
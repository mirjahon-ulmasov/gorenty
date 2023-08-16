/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from 'react';
import type { InputRef } from 'antd';
import { Button, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { formatPhone, formatPlate } from '.';

export const getColumnSearchProps = <T extends object>(
    dataIndex: keyof T | string, 
    placeholder: string
): ColumnType<T> => {
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        _selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void) => {
            confirm();
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

    const getColumnValue = (record: T): string => {
        if (typeof dataIndex === 'string') {
            
            const keys = dataIndex.split('.');
            let value: string | object = record;
            // eslint-disable-next-line no-restricted-syntax
            for (const key of keys) {
                value = (value as any)[key];
                if (!value) break;
            }
            if(dataIndex === 'phone_number') {
                return formatPhone(value as string)
            }
            else if(['vehicle.plate_number', 'plate_number'].includes(dataIndex)) {
                return formatPlate(value as string)
            }
            return value as string;
        }
        return '';
    };

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    value={selectedKeys[0]}
                    placeholder={`Search ${placeholder}`}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button 
                        size="small" 
                        type="primary" 
                        style={{ width: 90 }}
                        icon={<SearchOutlined />} 
                        onClick={() => handleSearch(selectedKeys as string[], confirm)}
                    >
                        Поиск
                    </Button>
                    <Button 
                        size="small" 
                        style={{ width: 90 }} 
                        onClick={() => clearFilters && handleReset(clearFilters)}
                    >
                        Сбросить
                    </Button>
                    <Button type="link" size="small" onClick={close}>
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? '#ff561f' : undefined }}
            />
        ),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (_, record) => getColumnValue(record),
    };
};


// import { useRef, useState } from 'react';
// import type { InputRef } from 'antd';
// import { Button, Space, Input } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import type { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
// import { formatPhone } from '.';
// import Highlighter from 'react-highlight-words';

// export const getColumnSearchProps = <T extends object>(
//     dataIndex: keyof T | string, 
//     placeholder: string
// ): ColumnType<T> => {
//     const [searchedColumn, setSearchedColumn] = useState<keyof T | string>('');
//     const [searchText, setSearchText] = useState('');
//     const searchInput = useRef<InputRef>(null);

//     const handleSearch = (selectedKeys: string[],confirm: (param?: FilterConfirmProps) => void) => {
//         confirm();
//         setSearchText(selectedKeys[0]);
//         setSearchedColumn(dataIndex);
//     };

//     const handleReset = (clearFilters: () => void) => {
//         clearFilters();
//         setSearchText('');
//     };

//     const getColumnValue = (record: T): string => {
//         if (typeof dataIndex === 'string') {
            
//             const keys = dataIndex.split('.');
//             let value: string | object = record;
//             // eslint-disable-next-line no-restricted-syntax
//             for (const key of keys) {
//                 value = (value as any)[key];
//                 if (!value) break;
//             }
//             if(dataIndex === 'phone_number') {
//                 return formatPhone(value as string)
//             }
//             return value as string;
//         }
//         return '';
//     };

//     return {
//         filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
//             <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
//                 <Input
//                     ref={searchInput}
//                     value={selectedKeys[0]}
//                     placeholder={`Search ${placeholder}`}
//                     onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                     onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
//                     style={{ marginBottom: 8, display: 'block' }}
//                 />
//                 <Space>
//                     <Button 
//                         size="small" 
//                         type="primary" 
//                         style={{ width: 90 }}
//                         icon={<SearchOutlined />} 
//                         onClick={() => handleSearch(selectedKeys as string[], confirm)}
//                     >
//                         Поиск
//                     </Button>
//                     <Button 
//                         size="small" 
//                         style={{ width: 90 }} 
//                         onClick={() => clearFilters && handleReset(clearFilters)}
//                     >
//                         Сбросить
//                     </Button>
//                     <Button type="link" size="small" onClick={close}>
//                         Закрыть
//                     </Button>
//                 </Space>
//             </div>
//         ),
//         filterIcon: (filtered: boolean) => (
//             <SearchOutlined
//                 style={{ color: filtered ? '#1677ff' : undefined }}
//             />
//         ),
//         onFilter: (value, record) =>
//             String(getColumnValue(record))
//                 .toLowerCase()
//                 .includes((value as string).toLowerCase()),
//         onFilterDropdownOpenChange: (visible) => {
//             if (visible) {
//                 setTimeout(() => searchInput.current?.select(), 100);
//             }
//         },
//         render: (_, record) =>
//             searchedColumn === dataIndex ? (
//                 <Highlighter
//                     autoEscape
//                     searchWords={[searchText]}
//                     textToHighlight={getColumnValue(record)}
//                     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//                 />
//             ) : (
//                 getColumnValue(record)
//             ),
//     };
// };
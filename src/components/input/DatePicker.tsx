import { DatePicker, DatePickerProps } from 'antd'
import { DatePickerIcon } from 'components/input'

export const CustomDatePicker = (props: DatePickerProps) => {
    return <DatePicker suffixIcon={<DatePickerIcon />} {...props} />
}

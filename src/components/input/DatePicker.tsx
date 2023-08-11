import { DatePicker, DatePickerProps } from 'antd'
import { DatePickerIcon } from 'assets/images/Icons'

export const CustomDatePicker = (props: DatePickerProps) => {
    return <DatePicker suffixIcon={<DatePickerIcon />} {...props} />
}

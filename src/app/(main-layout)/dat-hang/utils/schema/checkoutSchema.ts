import * as yup from 'yup'

export const checkoutSchema = yup.object({
    customer: yup.object().shape({
        name: yup.string().required('Vui lòng nhập tên').max(50, 'Không được vượt quá 50 ký tự!'),
        phone: yup.string().matches(
            /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}?\)?[-.\s]?)?(\d{1,4}[-.\s]?)?\d{1,9}$/, 
            'Phone number is not valid'
          ).required('Vui lòng nhập số điện thoại').max(15, 'Không được vượt quá 11 ký tự!'),
        mail: yup.string().email('Vui lòng nhập đúng định dạng email').max(50, 'Không được vượt quá 11 ký tự!'),
    }),
    address: yup.object().shape({
        city: yup
        .string()
        .max(30, 'Độ dài tối đa là 30 ký tự!'),
        district: yup
        .string()
        .max(30, 'Độ dài tối đa là 30 ký tự!'),
        ward: yup
        .string()
        .max(30, 'Độ dài tối đa là 30 ký tự!'),
        detail_address: yup
        .string()
        .min(3, 'Độ dài tối thiểu là 3 ký tự!')
        .max(50, 'Độ dài tối đa là 50 ký tự!'),
    }),
})
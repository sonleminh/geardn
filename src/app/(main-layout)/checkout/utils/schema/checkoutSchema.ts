import * as yup from 'yup'

export const checkoutSchema = yup.object({
    name: yup.string().required('Vui lòng nhập tên').max(50, 'Không được vượt quá 50 ký tự!'),
    phone: yup.string().required('Vui lòng nhập số điện thoại').max(50, 'Không được vượt quá 11 ký tự!'),
    email: yup.string().email('Vui lòng nhập đúng định dạng email').max(50, 'Không được vượt quá 11 ký tự!'),
     address: yup.object().shape({
        city: yup
        .string().required('Vui lòng chọn tỉnh/thành phố')
        .max(30, 'Độ dài tối đa là 30 ký tự!'),
        district: yup
        .string().required('Vui lòng chọn quận/huyện')
        .max(30, 'Độ dài tối đa là 30 ký tự!'),
        ward: yup
        .string().required('Vui lòng chọn phường/xã')
        .max(30, 'Độ dài tối đa là 30 ký tự!'),
        specific_address: yup
        .string().required('Vui lòng chọn địa chỉ cụ thể')
        .min(3, 'Độ dài tối thiểu là 3 ký tự!')
        .max(50, 'Độ dài tối đa là 50 ký tự!'),
    }),
    // category: yup.string().required('Nội dung này không được để trống!'),
    // tags: yup.array().max(3, 'Nhập tối đa 3 tag!'),
    // attributes: yup.array().max(3, 'Nhập tối đa 3 phân loại!'),
    // sku_name: yup.string().required('Nội dung này không được để trống!').max(20, 'Không được vượt quá 20 ký tự!'),
    // images: yup.array().min(1,'Ảnh không được để trống!').max(3, 'Sản phẩm yêu cầu tối đa 3 ảnh!'),
    // brand: yup.string().max(20, 'Không được vượt quá 20 ký tự!'),
    // details: yup.object().shape({
    //     guarantee: yup
    //       .string()
    //       .max(20, 'Độ dài tối đa là 20 ký tự!'),
    //       weight: yup
    //       .string()
    //       .max(20, 'Độ dài tối đa là 20 ký tự!'),
    //       material: yup
    //       .string()
    //       .max(20, 'Độ dài tối đa là 20 ký tự!'),
    // }),
    // description: yup.string().required('Nội dung này không được để trống!')
})
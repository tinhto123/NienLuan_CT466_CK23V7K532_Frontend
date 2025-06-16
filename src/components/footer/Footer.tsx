export default function Footer() {
  return (
    <footer className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='lg:col-span-1'>© 2022 SP Clone Typescript. Tất cả các quyền được bảo lưu.</div>
          <div className='lg:col-span-2 lg:text-center '>
            Quốc gia & Khu vực: Singapore Indonesia Đài Loan Thái Lan Malaysia Việt Nam Philippines Brazil México
            Colombia Chile Poland
          </div>
        </div>
        <div className='mt-10 text-center text-sm'>
          <div className='mt-2'>
            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 99999 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành
            phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 192222221 - Email: cskh2@hotro.SP Clone Typescript.vn
          </div>
          <div className='mt-2'>
            Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức - Điện thoại liên hệ: 024 11111 (ext 4678)
          </div>
          <div className='mt-2'>
            Mã số doanh nghiệp: 234234234 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/201555
          </div>
          <div className='mt-2'>© 2015 - Bản quyền thuộc về Công ty TNHH SP Clone Typescript</div>
        </div>
      </div>
    </footer>
  )
}

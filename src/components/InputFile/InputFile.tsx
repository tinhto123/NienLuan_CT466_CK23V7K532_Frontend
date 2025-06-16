import { Fragment, useRef } from 'react'
import Button from '../Button'
import config from 'src/constants/config'
import { toast } from 'react-toastify'

interface Props {
  onChange?: (file: File | undefined) => void
}
export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error(`Dụng lượng file tối đa 1 MB
      Định dạng:.JPEG, .PNG`)
    } else {
      onChange && onChange(fileFromLocal)
    }
  }
  const handleUnload = () => {
    fileInputRef.current?.click()
  }
  return (
    <Fragment>
      {' '}
      <input
        type='file'
        hidden
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onChangeFile}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value = null
        }}
      />
      <Button
        type='button'
        onClick={handleUnload}
        className='flex h-auto items-center justify-end rounded-sm border bg-white px-6 py-2 text-sm text-gray-600 shadow-sm'
      >
        Chọn ảnh
      </Button>
    </Fragment>
  )
}

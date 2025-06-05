import { range } from 'lodash'
import { useState, useEffect } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}
export default function DateSelect({ errorMessage, onChange, value }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueFromSelect } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: valueFromSelect
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  return (
    <div className='flex-wraps mt-3 flex flex-col  sm:flex-row'>
      <div className='truncate pt-3  capitalize sm:w-[20%] sm:text-left'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            name='date'
            value={value?.getDate() || date.date}
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            onChange={handleChange}
            value={value?.getMonth() || date.month}
            name='month'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            value={value?.getFullYear() || date.year}
            name='year'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Năm</option>
            {range(1990, 2030).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className=' mt-3 min-h-[1.25rem]  text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}

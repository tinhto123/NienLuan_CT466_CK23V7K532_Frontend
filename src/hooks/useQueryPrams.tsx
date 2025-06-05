import { useSearchParams } from 'react-router-dom'

export default function useQueryPrams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}

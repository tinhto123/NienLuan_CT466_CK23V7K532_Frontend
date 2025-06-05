import { isUndefined, omitBy } from 'lodash'
import useQueryPrams from './useQueryPrams'
import { ProductConfig } from 'src/types/product.type'

export type QueryConfig = {
  [key in keyof ProductConfig]: string
}
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryPrams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit,
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}

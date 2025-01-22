import type { Errors, Option } from './index'

export interface ActivityLogFilters {
  keywords: string
  dateFrom: string
  dateTo: string
  compliance: string[]
}

export interface SelectedFilterItem {
  text: string
  href: string
}

export interface ActivityLogRequestBody {
  keywords: string
  dateFrom: string
  dateTo: string
  compliance: string[]
}

export interface ActivityLogFiltersResponse extends ActivityLogFilters {
  errors: Errors
  selectedFilterItems: SelectedFilterItem[]
  complianceOptions: Option[]
  baseUrl: string
  queryStr: string
  queryStrPrefix: string
  queryStrSuffix: string
  maxDate: string
}

import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

import './appInsights'

govukFrontend.initAll()
mojFrontend.initAll()

/* eslint-disable func-names,no-plusplus */
MOJFrontend.BackendSortableTable = function (params) {
  this.table = $(params.table)

  if (this.table.data('moj-search-toggle-initialised')) {
    return
  }

  this.table.data('moj-search-toggle-initialised', true)

  this.setupOptions(params)
  this.body = this.table.find('tbody')
  this.createHeadingButtons()
  this.setNaturalOrder()
  this.createStatusBox()
  this.table.on('click', 'th button', $.proxy(this, 'onSortButtonClick'))
}

MOJFrontend.BackendSortableTable.prototype.check = function () {
  // Empty function
}

MOJFrontend.BackendSortableTable.prototype.setupOptions = function (nullableParams) {
  const params = nullableParams || {}
  this.statusMessage = params.statusMessage || 'Sort by %heading% (%direction%)'
  this.ascendingText = params.ascendingText || 'ascending'
  this.descendingText = params.descendingText || 'descending'
}

MOJFrontend.BackendSortableTable.prototype.createHeadingButtons = function () {
  const headings = this.table.find('thead th')
  let heading
  let i = 0
  for (const head of headings) {
    heading = $(head)
    if (heading.attr('aria-sort')) {
      this.createHeadingButton(heading, i)
      i++
    }
  }
}

MOJFrontend.BackendSortableTable.prototype.setNaturalOrder = function () {
  const headings = this.table.find('thead th')
  let heading
  this.naturalSortColumn = 0
  this.naturalSortDirection = 'ascending'
  let i = 0
  for (const head of headings) {
    heading = $(head)
    if (heading.attr('aria-sort-natural')) {
      this.naturalSortColumn = i
      this.naturalSortDirection = heading.attr('aria-sort-natural')
      break
    }
    i++
  }
}

MOJFrontend.BackendSortableTable.prototype.createHeadingButton = function (heading, i) {
  const text = heading.text()
  const button = $(`<button type="button" data-index="${i}">${text}</button>`)
  heading.text('')
  heading.append(button)
}

MOJFrontend.BackendSortableTable.prototype.createStatusBox = function () {
  this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="govuk-visually-hidden" />')
  this.table.parent().append(this.status)
}

MOJFrontend.BackendSortableTable.prototype.onSortButtonClick = function (e) {
  const sortDirection = $(e.currentTarget).parent().attr('aria-sort')
  const action = $(e.currentTarget).parent().attr('action')
  let backendSortDirection
  if (sortDirection === 'none' || sortDirection === 'descending') {
    backendSortDirection = 'asc'
  } else {
    backendSortDirection = 'desc'
  }

  const columnName = $(e.currentTarget).parent().attr('col-name')
  const sortBy = `${columnName}.${backendSortDirection}`

  window.location = `/${action}?sortBy=${sortBy}`
}

MOJFrontend.BackendSortableTable.prototype.sort = function (rows, columnNumber, sortDirection) {
  return rows.sort(
    $.proxy(function (rowA, rowB) {
      const tdA = $(rowA).find('td').eq(columnNumber)
      const tdB = $(rowB).find('td').eq(columnNumber)
      const valueA = this.getCellValue(tdA)
      const valueB = this.getCellValue(tdB)
      if (sortDirection === 'ascending') {
        if (valueA < valueB) {
          return -1
        }
        if (valueA > valueB) {
          return 1
        }
        return this.sortNatural(rowA, rowB)
      }
      if (valueB < valueA) {
        return -1
      }
      if (valueB > valueA) {
        return 1
      }
      return this.sortNatural(rowA, rowB)
    }, this),
  )
}

MOJFrontend.BackendSortableTable.prototype.sortNatural = function (rowA, rowB) {
  const tdA = $(rowA).find('td').eq(this.naturalSortColumn)
  const tdB = $(rowB).find('td').eq(this.naturalSortColumn)
  const valueA = this.getCellValue(tdA)
  const valueB = this.getCellValue(tdB)
  if (this.naturalSortDirection === 'ascending') {
    if (valueA < valueB) {
      return -1
    }
    if (valueA > valueB) {
      return 1
    }
    return 0
  }
  if (valueB < valueA) {
    return -1
  }
  if (valueB > valueA) {
    return 1
  }
  return 0
}

MOJFrontend.BackendSortableTable.prototype.getCellValue = function (cell) {
  let val = cell.attr('data-sort-value')
  val = val || cell.html()
  if ($.isNumeric(val)) {
    val = parseInt(val, 10)
  }
  return val
}

/* eslint-disable no-restricted-globals */
const lastAppointment = () => {
  const repeatingFrequency = document.querySelector('div[data-repeating-frequency]')
  if (repeatingFrequency) {
    const repeatingFrequencyRadios = repeatingFrequency.querySelectorAll('input[type="radio"]')
    const repeatingCount = document.querySelector('div[data-repeating-count] input')
    const lastAppointmentElm = document.querySelector('div[data-last-appointment')
    const lastAppointmentHandler = async () => {
      const repeatingFrequencyRadioSelected = repeatingFrequency.querySelector('input:checked')
      if (parseInt(repeatingCount.value, 10) > 0 && repeatingFrequencyRadioSelected) {
        const divider = location.href.includes('?') ? '&' : '?'
        const url = `${location.href}${divider}repeating-frequency=${encodeURI(repeatingFrequencyRadioSelected.value)}&repeating-count=${repeatingCount.value}`
        const headers = {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers,
        })
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const element = doc.querySelector('div[data-last-appointment]').innerHTML
        document.querySelector('div[data-last-appointment]').innerHTML = element
      } else {
        lastAppointmentElm.innerHTML = ''
      }
    }
    repeatingFrequencyRadios.forEach(input => input.addEventListener('click', lastAppointmentHandler))
    repeatingCount.addEventListener('keyup', lastAppointmentHandler)
  }
}
const resetConditionals = () => {
  const handleReset = () => {
    document.querySelectorAll('.govuk-radios__conditional input').forEach(radioBtn => {
      // eslint-disable-next-line no-param-reassign
      radioBtn.checked = false
    })
  }
  const elm = document.querySelector('[data-reset-conditional-radios]')
  if (elm) {
    // eslint-disable-next-line no-shadow
    document.querySelectorAll('[data-reset-conditional-radios]').forEach(elm => {
      elm.addEventListener('click', handleReset)
    })
  }
}
lastAppointment()
resetConditionals()

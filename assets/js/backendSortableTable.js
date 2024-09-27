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
  //Empty function
}

MOJFrontend.BackendSortableTable.prototype.setupOptions = function (params) {
  params = params || {}
  this.statusMessage = params.statusMessage || 'Sort by %heading% (%direction%)'
  this.ascendingText = params.ascendingText || 'ascending'
  this.descendingText = params.descendingText || 'descending'
}

MOJFrontend.BackendSortableTable.prototype.createHeadingButtons = function () {
  const headings = this.table.find('thead th')
  let heading
  for (let i = 0; i < headings.length; i++) {
    heading = $(headings[i])
    if (heading.attr('aria-sort')) {
      this.createHeadingButton(heading, i)
    }
  }
}

MOJFrontend.BackendSortableTable.prototype.setNaturalOrder = function () {
  const headings = this.table.find('thead th')
  let heading
  this.naturalSortColumn = 0
  this.naturalSortDirection = 'ascending'
  for (let i = 0; i < headings.length; i++) {
    heading = $(headings[i])
    if (heading.attr('aria-sort-natural')) {
      this.naturalSortColumn = i
      this.naturalSortDirection = heading.attr('aria-sort-natural')
      break
    }
  }
}

MOJFrontend.BackendSortableTable.prototype.createHeadingButton = function (heading, i) {
  const text = heading.text()
  const button = $('<button type="button" data-index="' + i + '">' + text + '</button>')
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
  const sortBy = columnName + '.' + backendSortDirection

  window.location = `/${action}?sortBy=${sortBy}`
}

MOJFrontend.BackendSortableTable.prototype.updateButtonState = function (button, direction) {
  button.parent().attr('aria-sort', direction)
  let message = this.statusMessage
  message = message.replace(/%heading%/, button.text())
  message = message.replace(/%direction%/, this[direction + 'Text'])
  this.status.text(message)
}

MOJFrontend.BackendSortableTable.prototype.removeButtonStates = function () {
  this.table.find('thead th').attr('aria-sort', 'none')
}

MOJFrontend.BackendSortableTable.prototype.addRows = function (rows) {
  for (let i = 0; i < rows.length; i++) {
    this.body.append(rows[i])
  }
}

MOJFrontend.BackendSortableTable.prototype.getTableRowsArray = function () {
  const rows = []
  const trs = this.body.find('tr')
  for (let i = 0; i < trs.length; i++) {
    rows.push(trs[i])
  }
  return rows
}

MOJFrontend.BackendSortableTable.prototype.sort = function (rows, columnNumber, sortDirection) {
  return rows.sort(
    $.proxy(function (rowA, rowB) {
      var tdA = $(rowA).find('td').eq(columnNumber)
      var tdB = $(rowB).find('td').eq(columnNumber)
      var valueA = this.getCellValue(tdA)
      var valueB = this.getCellValue(tdB)
      if (sortDirection === 'ascending') {
        if (valueA < valueB) {
          return -1
        }
        if (valueA > valueB) {
          return 1
        }
        return this.sortNatural(rowA, rowB)
      } else {
        if (valueB < valueA) {
          return -1
        }
        if (valueB > valueA) {
          return 1
        }
        return this.sortNatural(rowA, rowB)
      }
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
  } else {
    if (valueB < valueA) {
      return -1
    }
    if (valueB > valueA) {
      return 1
    }
    return 0
  }
}

MOJFrontend.BackendSortableTable.prototype.getCellValue = function (cell) {
  let val = cell.attr('data-sort-value')
  val = val || cell.html()
  if ($.isNumeric(val)) {
    val = parseInt(val, 10)
  }
  return val
}

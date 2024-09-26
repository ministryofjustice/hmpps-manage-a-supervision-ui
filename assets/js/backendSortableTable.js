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

MOJFrontend.BackendSortableTable.prototype.setupOptions = function (params) {
  params = params || {}
  this.statusMessage = params.statusMessage || 'Sort by %heading% (%direction%)'
  this.ascendingText = params.ascendingText || 'ascending'
  this.descendingText = params.descendingText || 'descending'
}

MOJFrontend.BackendSortableTable.prototype.createHeadingButtons = function () {
  var headings = this.table.find('thead th')
  var heading
  for (var i = 0; i < headings.length; i++) {
    heading = $(headings[i])
    if (heading.attr('aria-sort')) {
      this.createHeadingButton(heading, i)
    }
  }
}

MOJFrontend.BackendSortableTable.prototype.setNaturalOrder = function () {
  var headings = this.table.find('thead th')
  var heading
  this.naturalSortColumn = 0
  this.naturalSortDirection = 'ascending'
  for (var i = 0; i < headings.length; i++) {
    heading = $(headings[i])
    if (heading.attr('aria-sort-natural')) {
      this.naturalSortColumn = i
      this.naturalSortDirection = heading.attr('aria-sort-natural')
      break
    }
  }
}

MOJFrontend.BackendSortableTable.prototype.createHeadingButton = function (heading, i) {
  var text = heading.text()
  var button = $('<button type="button" data-index="' + i + '">' + text + '</button>')
  heading.text('')
  heading.append(button)
}

MOJFrontend.BackendSortableTable.prototype.createStatusBox = function () {
  this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="govuk-visually-hidden" />')
  this.table.parent().append(this.status)
}

MOJFrontend.BackendSortableTable.prototype.onSortButtonClick = function (e) {
  var columnNumber = e.currentTarget.getAttribute('data-index')
  var sortDirection = $(e.currentTarget).parent().attr('aria-sort')
  var newSortDirection
  var backendSortDirection
  if (sortDirection === 'none' || sortDirection === 'descending') {
    backendSortDirection = 'asc'
  } else {
    backendSortDirection = 'desc'
  }

  var columnName = $(e.currentTarget).parent().attr('col-name')

  var sortBy = columnName + '.' + backendSortDirection

  window.location = `/case?sortBy=${sortBy}`
}

MOJFrontend.BackendSortableTable.prototype.updateButtonState = function (button, direction) {
  button.parent().attr('aria-sort', direction)
  var message = this.statusMessage
  message = message.replace(/%heading%/, button.text())
  message = message.replace(/%direction%/, this[direction + 'Text'])
  this.status.text(message)
}

MOJFrontend.BackendSortableTable.prototype.removeButtonStates = function () {
  this.table.find('thead th').attr('aria-sort', 'none')
}

MOJFrontend.BackendSortableTable.prototype.addRows = function (rows) {
  for (var i = 0; i < rows.length; i++) {
    this.body.append(rows[i])
  }
}

MOJFrontend.BackendSortableTable.prototype.getTableRowsArray = function () {
  var rows = []
  var trs = this.body.find('tr')
  for (var i = 0; i < trs.length; i++) {
    rows.push(trs[i])
  }
  return rows
}

MOJFrontend.BackendSortableTable.prototype.sort = function (rows, columnNumber, sortDirection) {
  var newRows = rows.sort(
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
  return newRows
}

MOJFrontend.BackendSortableTable.prototype.sortNatural = function (rowA, rowB) {
  var tdA = $(rowA).find('td').eq(this.naturalSortColumn)
  var tdB = $(rowB).find('td').eq(this.naturalSortColumn)
  var valueA = this.getCellValue(tdA)
  var valueB = this.getCellValue(tdB)
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
  var val = cell.attr('data-sort-value')
  val = val || cell.html()
  if ($.isNumeric(val)) {
    val = parseInt(val, 10)
  }
  return val
}

window.MOJFrontend.initAll()
$('.time-field').timepicker({ minTime: '9:00AM', maxTime: '4:45PM', step: 15 })
const $backendSortableTables = document.querySelectorAll('[data-module="moj-backend-sortable-table"]')
MOJFrontend.nodeListForEach($backendSortableTables, function ($table) {
  const best = new MOJFrontend.BackendSortableTable({
    table: $table,
  })
  best.check()
})

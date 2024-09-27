window.MOJFrontend.initAll()
var $backendSortableTables = document.querySelectorAll('[data-module="moj-backend-sortable-table"]')
MOJFrontend.nodeListForEach($backendSortableTables, function ($table) {
  const best = new MOJFrontend.BackendSortableTable({
    table: $table,
  })
  best.check
})

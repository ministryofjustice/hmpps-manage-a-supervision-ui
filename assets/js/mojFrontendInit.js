window.MOJFrontend.initAll()
var $backendSortableTables = document.querySelectorAll('[data-module="moj-backend-sortable-table"]')
MOJFrontend.nodeListForEach($backendSortableTables, function ($table) {
  new MOJFrontend.BackendSortableTable({
    table: $table,
  })
})

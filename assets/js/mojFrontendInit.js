window.MOJFrontend.initAll()
const $backendSortableTables = document.querySelectorAll('[data-module="moj-backend-sortable-table"]')
MOJFrontend.nodeListForEach($backendSortableTables, function f($table) {
  const best = new MOJFrontend.BackendSortableTable({
    table: $table,
  })
  best.check()
})

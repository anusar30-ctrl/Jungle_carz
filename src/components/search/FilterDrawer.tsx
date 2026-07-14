import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import type { FilterState } from '../../types/search'
import { DEFAULT_FILTERS } from '../../constants/filters'
import { FilterPanelContent } from './FilterSidebar'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  draftFilters: FilterState
  onDraftChange: (filters: FilterState) => void
  onApply: () => void
  onReset: () => void
  resultCount: number
}

export function FilterDrawer({
  open,
  onClose,
  draftFilters,
  onDraftChange,
  onApply,
  onReset,
  resultCount,
}: FilterDrawerProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-[24px] bg-white shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filter cars"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-dark">Filters</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4">
                <FilterPanelContent
                  filters={draftFilters}
                  onChange={onDraftChange}
                  onReset={() => onDraftChange(DEFAULT_FILTERS)}
                  showActions={false}
                />
              </div>

              <div className="flex gap-3 border-t border-gray-100 p-5">
                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 rounded-2xl border border-gray-200 py-3.5 text-sm font-semibold text-dark"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onApply}
                  className="flex-1 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25"
                >
                  Show {resultCount} Cars
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function MobileFilterButton({
  onClick,
  activeCount,
}: {
  onClick: () => void
  activeCount: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark shadow-soft lg:hidden"
    >
      <SlidersHorizontal className="h-4 w-4 text-primary" />
      Filters
      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
          {activeCount}
        </span>
      )}
    </button>
  )
}

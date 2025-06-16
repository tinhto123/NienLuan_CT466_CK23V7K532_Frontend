import { useFloating, FloatingPortal, arrow, shift, offset, type Placement } from '@floating-ui/react'
import { useState, useRef, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  renderProps?: React.ReactNode
  placement?: Placement | undefined
}
export default function Popover({ children, className, renderProps, placement = 'bottom-end' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const id = useId()
  const arrowRef = useRef<HTMLElement>(null)
  const { refs, strategy, x, y, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement
  })
  const showPopover = () => {
    setIsOpen(true)
  }
  const hidenPopover = () => {
    setIsOpen(false)
  }
  return (
    <div id={id} className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidenPopover}>
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                top: y,
                left: x,
                position: strategy,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-b-white border-t-transparent'
                style={{
                  top: middlewareData.arrow?.y,
                  left: middlewareData.arrow?.x
                }}
              ></span>
              {renderProps}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}

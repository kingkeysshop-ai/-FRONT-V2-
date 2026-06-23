import { clx } from "@modules/common/components/ui"

const Divider = ({ className }: { className?: string }) => (
  <div
    className={clx("h-px w-full border-b border-[#2a2a2a] mt-1", className)}
  />
)

export default Divider

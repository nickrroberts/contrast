import { Card } from "@/components/ui/card"
import { hexToRgb } from "@/lib/color-utils"

interface ColorDisplayProps {
  color: string
}

export default function ColorDisplay({ color }: ColorDisplayProps) {
  const rgb = hexToRgb(color)

  return (
    <Card className="overflow-hidden">
      <div className="h-20 w-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <div className="p-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-zinc-500 dark:text-zinc-400">HEX</span>
          <span>{color.toUpperCase()}</span>
        </div>
        {rgb && (
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">RGB</span>
            <span>{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

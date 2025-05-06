import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ContrastRatioProps {
  ratio: number
}

export default function ContrastRatio({ ratio }: ContrastRatioProps) {
  const formattedRatio = ratio.toFixed(2)

  // WCAG 2.1 compliance checks
  const passesAANormal = ratio >= 4.5
  const passesAALarge = ratio >= 3
  const passesAAANormal = ratio >= 7
  const passesAAALarge = ratio >= 4.5

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Contrast Ratio</h3>
        <div className="text-2xl font-bold">{formattedRatio}:1</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">WCAG 2.1 AA</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-zinc-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    AA requires a contrast ratio of at least 4.5:1 for normal text
                    <br />
                    and 3:1 for large text (18pt or 14pt bold).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between">
            <span>Normal text (4.5:1)</span>
            <ComplianceBadge passes={passesAANormal} />
          </div>
          <div className="flex items-center justify-between">
            <span>Large text (3:1)</span>
            <ComplianceBadge passes={passesAALarge} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">WCAG 2.1 AAA</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-zinc-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    AAA requires a contrast ratio of at least 7:1 for normal text
                    <br />
                    and 4.5:1 for large text (18pt or 14pt bold).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between">
            <span>Normal text (7:1)</span>
            <ComplianceBadge passes={passesAAANormal} />
          </div>
          <div className="flex items-center justify-between">
            <span>Large text (4.5:1)</span>
            <ComplianceBadge passes={passesAAALarge} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplianceBadge({ passes }: { passes: boolean }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        passes
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      }`}
    >
      {passes ? "Pass" : "Fail"}
    </span>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { EyeIcon as EyeDropper, RefreshCw, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import ColorDisplay from "./color-display"
import ContrastRatio from "./contrast-ratio"
import { calculateContrastRatio } from "@/lib/color-utils"

export default function ContrastChecker() {
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [contrastRatio, setContrastRatio] = useState(21)
  const [activeTab, setActiveTab] = useState("text")
  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false)
  const foregroundInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if EyeDropper API is supported
    setIsEyeDropperSupported("EyeDropper" in window)

    // Calculate initial contrast ratio
    updateContrastRatio(foregroundColor, backgroundColor)
  }, [])

  useEffect(() => {
    updateContrastRatio(foregroundColor, backgroundColor)
  }, [foregroundColor, backgroundColor])

  const updateContrastRatio = (fg: string, bg: string) => {
    const ratio = calculateContrastRatio(fg, bg)
    setContrastRatio(ratio)
  }

  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(e.target.value)
  }

  const pickColor = async (target: "foreground" | "background") => {
    if (!("EyeDropper" in window)) {
      toast({
        title: "Not supported",
        description: "The EyeDropper API is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    try {
      // @ts-ignore - EyeDropper is not in the TypeScript DOM types yet
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()

      if (target === "foreground") {
        setForegroundColor(result.sRGBHex)
        if (foregroundInputRef.current) {
          foregroundInputRef.current.value = result.sRGBHex
        }
      } else {
        setBackgroundColor(result.sRGBHex)
        if (backgroundInputRef.current) {
          backgroundInputRef.current.value = result.sRGBHex
        }
      }
    } catch (error) {
      console.log("User canceled the eyedropper")
    }
  }

  const swapColors = () => {
    setForegroundColor(backgroundColor)
    setBackgroundColor(foregroundColor)
  }

  const copyResults = () => {
    const result = `Foreground: ${foregroundColor}
Background: ${backgroundColor}
Contrast Ratio: ${contrastRatio.toFixed(2)}:1
WCAG 2.1 AA Text: ${contrastRatio >= 4.5 ? "Pass" : "Fail"}
WCAG 2.1 AA Large Text: ${contrastRatio >= 3 ? "Pass" : "Fail"}
WCAG 2.1 AAA Text: ${contrastRatio >= 7 ? "Pass" : "Fail"}
WCAG 2.1 AAA Large Text: ${contrastRatio >= 4.5 ? "Pass" : "Fail"}`

    navigator.clipboard.writeText(result)
    toast({
      title: "Copied to clipboard",
      description: "Contrast results have been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Foreground Color</h2>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    ref={foregroundInputRef}
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => handleColorChange(e, setForegroundColor)}
                    className="w-full h-12 cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-700"
                    aria-label="Select foreground color"
                  />
                </div>
                <input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => handleColorChange(e, setForegroundColor)}
                  className="w-28 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  aria-label="Foreground color hex value"
                />
                {isEyeDropperSupported && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => pickColor("foreground")}
                          aria-label="Pick foreground color with eyedropper"
                        >
                          <EyeDropper className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pick color from screen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <ColorDisplay color={foregroundColor} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Background Color</h2>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    ref={backgroundInputRef}
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => handleColorChange(e, setBackgroundColor)}
                    className="w-full h-12 cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-700"
                    aria-label="Select background color"
                  />
                </div>
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => handleColorChange(e, setBackgroundColor)}
                  className="w-28 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  aria-label="Background color hex value"
                />
                {isEyeDropperSupported && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => pickColor("background")}
                          aria-label="Pick background color with eyedropper"
                        >
                          <EyeDropper className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pick color from screen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <ColorDisplay color={backgroundColor} />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={swapColors} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Swap Colors
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy Results
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="ui">UI Elements</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4">
              <div
                className="p-6 rounded-md text-center"
                style={{
                  backgroundColor: backgroundColor,
                  color: foregroundColor,
                }}
              >
                <p className="text-sm mb-2">Small Text (16px)</p>
                <p className="text-2xl">Large Text (24px)</p>
              </div>
            </TabsContent>
            <TabsContent value="ui" className="space-y-4">
              <div className="p-6 rounded-md" style={{ backgroundColor: backgroundColor }}>
                <div
                  className="p-3 rounded-md mb-3 inline-block"
                  style={{
                    backgroundColor: foregroundColor,
                    color: backgroundColor,
                  }}
                >
                  Button
                </div>
                <div
                  className="p-3 rounded-md inline-block"
                  style={{
                    border: `2px solid ${foregroundColor}`,
                    color: foregroundColor,
                  }}
                >
                  Outlined Button
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <ContrastRatio ratio={contrastRatio} />
        </CardContent>
      </Card>
    </div>
  )
}

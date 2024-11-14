// components/form/FabricDetailsStep.tsx
'use client'

import { useState, useEffect } from 'react'
import { FormData, FabricDetails, ColorQuantity } from "@/types/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Plus, Trash } from "lucide-react"
import { FABRICS, PROCESSES, STAGES } from "@/lib/constants"
import { toast } from "sonner"

interface FabricDetailsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export function FabricDetailsStep({ formData, updateFormData }: FabricDetailsStepProps) {
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([])
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const usedFabrics = formData.fabrics.map(f => f.name).filter(Boolean)
    const newAvailableFabrics = FABRICS.filter(f => !usedFabrics.includes(f))
    setAvailableFabrics(newAvailableFabrics)
  }, [formData.fabrics])

  const handleAddFabric = () => {
    if (formData.fabrics.length > 0) {
      setShowPrompt(true)
    }

    const newFabric: FabricDetails = {
      name: '',
      perPieceRequirement: '',
      unit: 'metre',
      processes: [],
      colors: [],
      quantity: '',
      skippedStages: [],
      trims: [],
      accessories: []
    }

    updateFormData({
      fabrics: [...formData.fabrics, newFabric]
    })
  }

  const handleRemoveFabric = (index: number) => {
    const newFabrics = [...formData.fabrics]
    const removedFabric = newFabrics[index]
    if (removedFabric.name) {
      setAvailableFabrics(prev => [...prev, removedFabric.name].sort())
    }
    newFabrics.splice(index, 1)
    updateFormData({ fabrics: newFabrics })
  }

  const handleFabricChange = (index: number, field: keyof FabricDetails, value: any) => {
    const newFabrics = [...formData.fabrics]
    const oldFabric = newFabrics[index]

    if (field === 'name') {
      if (oldFabric.name) {
        setAvailableFabrics(prev => [...prev, oldFabric.name].sort())
      }
      setAvailableFabrics(prev => prev.filter(f => f !== value))
    }

    newFabrics[index] = { ...oldFabric, [field]: value }
    updateFormData({ fabrics: newFabrics })
  }

  const handleAddColor = (fabricIndex: number) => {
    const newFabrics = [...formData.fabrics]
    const fabric = newFabrics[fabricIndex]

    const totalColorQuantity = fabric.colors.reduce(
      (sum, color) => sum + Number(color.quantity), 0
    )

    const remainingQuantity = Number(fabric.quantity) - totalColorQuantity

    if (remainingQuantity <= 0) {
      toast.error("All quantity has been allocated to colors")
      return
    }

    fabric.colors.push({
      color: '',
      quantity: ''
    })

    updateFormData({ fabrics: newFabrics })
  }

  const handleColorChange = (
    fabricIndex: number,
    colorIndex: number,
    field: keyof ColorQuantity,
    value: string
  ) => {
    const newFabrics = [...formData.fabrics]
    const fabric = newFabrics[fabricIndex]

    if (field === 'quantity') {
      const otherColorsTotal = fabric.colors.reduce((sum, color, idx) =>
        idx !== colorIndex ? sum + Number(color.quantity) : sum, 0
      )

      if (otherColorsTotal + Number(value) > Number(fabric.quantity)) {
        toast.error("Total color quantities cannot exceed fabric quantity")
        return
      }
    }

    fabric.colors[colorIndex] = {
      ...fabric.colors[colorIndex],
      [field]: value
    }

    updateFormData({ fabrics: newFabrics })
  }

  const handleRemoveColor = (fabricIndex: number, colorIndex: number) => {
    const newFabrics = [...formData.fabrics]
    newFabrics[fabricIndex].colors.splice(colorIndex, 1)
    updateFormData({ fabrics: newFabrics })
  }

  const handleQuantityChange = (index: number, value: string) => {
    if (Number(value) <= 0) {
      toast.error("Quantity must be greater than 0")
      return
    }

    const otherFabricsQty = formData.fabrics.reduce((sum, fabric, i) =>
      i !== index ? sum + Number(fabric.quantity) : sum, 0
    )

    if (otherFabricsQty + Number(value) > Number(formData.totalOrderQuantity)) {
      toast.error("Total fabric quantities cannot exceed order quantity")
      return
    }

    handleFabricChange(index, 'quantity', value)
  }

  const renderColorSection = (fabricIndex: number) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Colors and Quantities</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddColor(fabricIndex)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Color
        </Button>
      </div>

      <div className="space-y-2">
        {formData.fabrics[fabricIndex].colors.map((color, colorIndex) => (
          <div key={colorIndex} className="flex gap-2 items-center">
            <Input
              placeholder="Color name"
              value={color.color}
              onChange={(e) => handleColorChange(
                fabricIndex,
                colorIndex,
                'color',
                e.target.value
              )}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={color.quantity}
              onChange={(e) => handleColorChange(
                fabricIndex,
                colorIndex,
                'quantity',
                e.target.value
              )}
              className="w-32"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveColor(fabricIndex, colorIndex)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {formData.fabrics[fabricIndex].quantity && (
        <div className="text-sm text-muted-foreground">
          Allocated: {formData.fabrics[fabricIndex].colors.reduce(
            (sum, color) => sum + Number(color.quantity), 0
          )} / {formData.fabrics[fabricIndex].quantity}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {formData.fabrics.map((fabric, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Fabric {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFabric(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Fabric Name</Label>
                <Select
                  value={fabric.name}
                  onValueChange={(value) => handleFabricChange(index, 'name', value)}
                >
                  <SelectTrigger>
                    {fabric.name ? (
                      <SelectValue>{fabric.name}</SelectValue>
                    ) : (
                      <SelectValue placeholder="Select fabric" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {availableFabrics.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>

              <div>
                <Label>Per Piece Requirement</Label>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={fabric.perPieceRequirement}
                  onChange={(e) => handleFabricChange(index, 'perPieceRequirement', e.target.value)}
                />
              </div>
            </div>

            {/* Unit Selection */}
            <div>
              <Label>Unit</Label>
              <RadioGroup
                value={fabric.unit}
                onValueChange={(value) => handleFabricChange(index, 'unit', value as 'metre' | 'kg')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metre" id={`metre-${index}`} />
                  <Label htmlFor={`metre-${index}`}>Metre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kg" id={`kg-${index}`} />
                  <Label htmlFor={`kg-${index}`}>Kg</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Processes */}
            <div>
              <Label>Processes</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-md">
                {PROCESSES.map((process) => (
                  <div key={process} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${process}-${index}`}
                      checked={fabric.processes.includes(process)}
                      onChange={() => {
                        const newProcesses = fabric.processes.includes(process)
                          ? fabric.processes.filter(p => p !== process)
                          : [...fabric.processes, process]
                        handleFabricChange(index, 'processes', newProcesses)
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`${process}-${index}`}>{process}</Label>
                  </div>
                ))}
              </div>
            </div>


                 {/* Total Quantity */}
                 <div>
              <Label>Total Quantity</Label>
              <Input
                type="number"
                min="1"
                value={fabric.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className={Number(fabric.quantity) > Number(formData.totalOrderQuantity)
                  ? 'border-red-500'
                  : ''
                }
              />
              {fabric.quantity && (
                <p className="text-sm text-muted-foreground mt-1">
                  {((Number(fabric.quantity) / Number(formData.totalOrderQuantity)) * 100).toFixed(1)}% of total order
                </p>
              )}
            </div>

            {/* Colors */}
            {renderColorSection(index)}



            {/* Stages to Skip */}
            <div>
              <Label>Stages to Skip (Optional)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-md">
                {STAGES.map((stage) => (
                  <div key={stage} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`skip-${stage}-${index}`}
                      checked={fabric.skippedStages.includes(stage)}
                      onChange={() => {
                        const newStages = fabric.skippedStages.includes(stage)
                          ? fabric.skippedStages.filter(s => s !== stage)
                          : [...fabric.skippedStages, stage]
                        handleFabricChange(index, 'skippedStages', newStages)
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`skip-${stage}-${index}`}>{stage}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleAddFabric}
        className="w-full"
        disabled={formData.fabrics.length >= FABRICS.length}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Fabric
      </Button>

      {/* Prompt Dialog */}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Fabric Requirements</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide the following information for the additional fabric:
            </p>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>Fabric Name</li>
              <li>Per Piece Requirement</li>
              <li>Choose Unit (metre/kg)</li>
              <li>Processes</li>
              <li>Colors with Quantities</li>
              <li>Total Quantity</li>
              <li>Stages to Skip (optional)</li>
            </ul>
            <Button onClick={() => setShowPrompt(false)} className="w-full">
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
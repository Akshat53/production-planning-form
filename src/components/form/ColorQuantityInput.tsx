// components/form/ColorQuantityInput.tsx
import { ColorQuantity } from "@/types/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

interface ColorQuantityInputProps {
  color: ColorQuantity
  onChange: (color: ColorQuantity) => void
  onRemove: () => void
  fabricQuantity: string
  totalUsed: number
}

export function ColorQuantityInput({
  color,
  onChange,
  onRemove,
  fabricQuantity,
  totalUsed
}: ColorQuantityInputProps) {
  const remaining = Number(fabricQuantity) - totalUsed + Number(color.quantity)

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Color name"
        value={color.color}
        onChange={(e) => onChange({ ...color, color: e.target.value })}
        className="flex-1"
      />
      <div className="w-32 relative">
        <Input
          type="number"
          placeholder="Quantity"
          value={color.quantity}
          onChange={(e) => {
            const newQty = e.target.value
            if (Number(newQty) <= remaining) {
              onChange({ ...color, quantity: newQty })
            }
          }}
          min="0"
          max={remaining.toString()}
        />
        <span className="absolute right-2 top-2 text-xs text-gray-500">
          /{remaining}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onRemove}
        className="text-red-500"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}
// lib/validations.ts
import { FormData, FabricDetails, ValidationResult } from "@/types/form"

export const validateBasicInfo = (data: FormData): ValidationResult => {
  const errors: string[] = []

  if (!data.startDate) {
    errors.push("Start date is required")
  }

  if (!data.endDate) {
    errors.push("End date is required")
  }

  if (!data.productionPerDay) {
    errors.push("Production per day per machine is required")
  } else if (Number(data.productionPerDay) <= 0) {
    errors.push("Production per day must be greater than 0")
  }

  if (!data.totalOrderQuantity) {
    errors.push("Total order quantity is required")
  } else if (Number(data.totalOrderQuantity) <= 0) {
    errors.push("Total order quantity must be greater than 0")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateFabricDetails = (fabric: FabricDetails): ValidationResult => {
  const errors: string[] = []

  // Required fields according to project requirements
  if (!fabric.name) {
    errors.push("Fabric name is required")
  }

  if (!fabric.perPieceRequirement) {
    errors.push("Per piece requirement is required")
  } else if (Number(fabric.perPieceRequirement) <= 0) {
    errors.push("Per piece requirement must be greater than 0")
  }

  if (!fabric.unit) {
    errors.push("Unit selection (metre/kg) is required")
  }

  if (fabric.processes.length === 0) {
    errors.push("At least one process must be selected")
  }

  if (!fabric.colors) {
    errors.push("Color is required")
  }

  if (!fabric.quantity) {
    errors.push("Quantity is required")
  } else if (Number(fabric.quantity) <= 0) {
    errors.push("Quantity must be greater than 0")
  }

  // Note: Stages to be skipped is optional according to requirements
  // but if selected, should be valid stages

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateFabricsQuantity = (
  fabrics: FabricDetails[],
  totalOrderQuantity: string
): ValidationResult => {
  const errors: string[] = []
  const total = fabrics.reduce((sum, fabric) => sum + Number(fabric.quantity), 0)

  if (total > Number(totalOrderQuantity)) {
    errors.push("Sum of all fabric quantities cannot exceed total order quantity")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateInternationalFabrics = (data: FormData): ValidationResult => {
  const errors: string[] = []

  // According to requirements:
  // 1. Must specify if international fabric is present
  if (data.hasInternationalFabric === null) {
    errors.push("Please specify if international fabric is present")
  }

  // 2. If Yes, must select China fabrics from previously selected fabrics
  if (data.hasInternationalFabric === true && data.chinaFabrics.length === 0) {
    errors.push("Please select at least one China fabric from your selected fabrics")
  }

  // 3. Major fabric selection
  if (!data.majorFabric) {
    errors.push("Please select a major fabric ('None' or one of your selected fabrics)")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateStep = (step: number, formData: FormData): ValidationResult => {
  switch (step) {
    case 1:
      return validateBasicInfo(formData)
    
    case 2: {
      // First check if there are any fabrics
      if (formData.fabrics.length === 0) {
        return {
          isValid: false,
          errors: ["At least one fabric must be added"]
        }
      }

      // Validate each fabric independently
      const fabricErrors: string[] = []
      formData.fabrics.forEach((fabric, index) => {
        const validation = validateFabricDetails(fabric)
        if (!validation.isValid) {
          validation.errors.forEach(error => {
            fabricErrors.push(`Fabric ${index + 1}: ${error}`)
          })
        }
      })

      // Validate total quantity
      const quantityValidation = validateFabricsQuantity(
        formData.fabrics,
        formData.totalOrderQuantity
      )
      
      return {
        isValid: fabricErrors.length === 0 && quantityValidation.isValid,
        errors: [...fabricErrors, ...quantityValidation.errors]
      }
    }

    case 3: {
      // International fabric and major fabric selection validation
      const validation = validateInternationalFabrics(formData)
      
      // If No for international fabric, no need for China fabric selection
      if (!formData.hasInternationalFabric && formData.chinaFabrics.length > 0) {
        validation.errors.push("China fabrics should not be selected when international fabric is No")
        validation.isValid = false
      }

      // Validate that major fabric is from selected fabrics
      if (formData.majorFabric !== 'none' && 
          !formData.fabrics.some(f => f.name === formData.majorFabric)) {
        validation.errors.push("Major fabric must be one of your selected fabrics or 'None'")
        validation.isValid = false
      }

      return validation
    }

    default:
      return { isValid: true, errors: [] }
  }
}

// Helper function to validate dropdown selection
export const validateFabricSelection = (
  selectedFabric: string,
  existingFabrics: string[]
): ValidationResult => {
  const errors: string[] = []
  
  if (existingFabrics.includes(selectedFabric)) {
    errors.push("This fabric has already been selected")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
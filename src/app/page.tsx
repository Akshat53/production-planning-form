// app/page.tsx
'use client'

import { ProductionPlanningForm } from "@/components/form/ProductionPlanningForm"


export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Production Planning Form
        </h1>
        <ProductionPlanningForm />
      </div>
    </main>
  )
}
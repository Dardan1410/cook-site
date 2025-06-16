"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UploadTest() {
  const [testResults, setTestResults] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testEnvironment = () => {
    addLog("=== Environment Test ===")
    addLog(`NODE_ENV: ${process.env.NODE_ENV}`)
    addLog(`Window location: ${typeof window !== "undefined" ? window.location.href : "Server-side"}`)

    // Test if we can reach the API
    fetch("/api/upload", { method: "GET" })
      .then((response) => {
        addLog(`API reachable: ${response.status}`)
      })
      .catch((error) => {
        addLog(`API error: ${error.message}`)
      })
  }

  const testBlobToken = async () => {
    addLog("=== Testing Blob Token ===")
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: new FormData(), // Empty form data to trigger token check
      })
      const data = await response.json()
      addLog(`Token test response: ${JSON.stringify(data)}`)
    } catch (error) {
      addLog(`Token test error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const clearLogs = () => {
    setTestResults([])
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Upload Debug Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={testEnvironment}>
            Test Environment
          </Button>
          <Button size="sm" variant="outline" onClick={testBlobToken}>
            Test Blob Token
          </Button>
          <Button size="sm" variant="outline" onClick={clearLogs}>
            Clear Logs
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-100 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

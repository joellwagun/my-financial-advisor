// Upload.jsx
// Upload Receipt page wired to the real backend.
// Backend endpoint: POST /ocr/extract/receipt/llm/save
// Expects: multipart/form-data with a "file" field (the image)
// Returns: { message, expense_id, parsed: { vendor, date, total_amount, currency, category, items } }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import client from "@/api/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Step 1 — user picks a file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  // Step 2 — user clicks "Scan & save"
  // Sends the image to the backend = OCR + LLM + DB save all in one call
  const handleScan = async () => {
    setScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await client.post("/ocr/extract/receipt/llm/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // res.data = { message, expense_id, parsed: {...} }
      setResult(res.data.parsed);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to scan receipt. Please try again.",
      );
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-md mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-medium">Upload a receipt</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Take a photo or choose an image of your receipt
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* File picker card */}
        <Card className="mb-4">
          <CardContent className="p-5">
            {!previewUrl && (
              <label
                htmlFor="receipt-file"
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-10 cursor-pointer hover:bg-muted/40"
              >
                <span className="text-3xl mb-2">📷</span>
                <span className="text-sm font-medium">
                  Click to choose an image
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  JPG or PNG
                </span>
              </label>
            )}

            <input
              id="receipt-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="w-full rounded-lg mb-3"
                />
                <label
                  htmlFor="receipt-file"
                  className="text-sm text-primary cursor-pointer hover:underline"
                >
                  Choose a different image
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scan button = only shows if file is picked and not yet scanned */}
        {file && !result && (
          <Button
            className="w-full mb-4"
            onClick={handleScan}
            disabled={scanning}
          >
            {scanning ? "Reading your receipt..." : "Scan & save receipt"}
          </Button>
        )}

        {/* Result card = shows what was extracted */}
        {result && (
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-sm font-medium text-green-600">
                ✓ Receipt saved successfully
              </p>

              <div className="text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor</span>
                  <span className="font-medium">{result.vendor || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{result.date || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {result.currency || "Rs."} {result.total_amount ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{result.category || "—"}</span>
                </div>
              </div>

              {result.items && result.items.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1.5">Items</p>
                  {result.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>{item.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                className="w-full mt-2"
                onClick={() => navigate("/dashboard")}
              >
                Go to dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

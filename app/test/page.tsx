"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

export default function FilesUpload() {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useUser(); // Get user info from Clerk

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.id) {
      alert('Please select a file and ensure you are logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('userId', user.id); // Passing userId in form data
    formData.append('courseCode', "CIS*2520"); // Hardcoded course code
    formData.append('uploadedFileName', selectedFile.name); // File name

    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle the response data
        alert('File uploaded successfully.');
        setFileName("");
        setSelectedFile(null);
      } else {
        console.error('Error uploading file:', response.statusText);
        alert('Error uploading file.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-3 pt-6 justify-between">
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium">Uploaded Files</p>

        <ScrollArea className="w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Files</h4>

            {/* Dynamically display uploaded files */}
            <div className="text-sm">{fileName ? fileName : "No files uploaded"}</div>
            <Separator className="my-2" />
          </div>
        </ScrollArea>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 mb-9">
        <Label htmlFor="file-input">Upload PDF File</Label>
        <Input
          id="file-input"
          type="file"
          accept=".pdf"
          className="w-full"
          onChange={handleFileChange}
        />
      </div>

      <Button onClick={handleUpload} disabled={!selectedFile || !user?.id}>
        Upload File
      </Button>
    </div>
  );
}

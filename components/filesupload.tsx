"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
export default function FilesUpload({courseId} : {courseId: string}) {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // const getFiles = async () => {


  // };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload");
      return;
    }

    if (!user || !user.id) {
      setUploadStatus("User information is missing");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("courseCode", courseId);
    formData.append("userId", user.id);
    formData.append("uploadedFileName", selectedFile.name);

    try {
      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("File upload successfully.");
      } else {
        setUploadStatus("File upload failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setUploadStatus("File upload failed :" + error.message);
      } else {
        setUploadStatus("File upload failed: unkonwn error");
      }
    }
  };
  return (
    <div className="flex flex-col h-full p-4 gap-3 pt-6 justify-between">
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium">Uploaded Files</p>

        <ScrollArea className="w-full  rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Files</h4>

            <div className="text-sm">React files</div>
            <Separator className="my-2" />
            
          </div>
        </ScrollArea>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 mb-9">
        <Label htmlFor="picture">Upload files</Label>
        <Input
          id="picture"
          type="file"
          className="w-full"
          onChange={handleFileChange}
        />
        <Button
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={handleFileUpload}
        >
          Upload
        </Button>
        {uploadStatus && <p className="text-sm mt-2">{uploadStatus}</p>}
      </div>
    </div>
  );
}

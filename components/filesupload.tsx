"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";

export default function ({ courseId }: { courseId: string }) {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [getFilesStatus, setGetFilesStatus] = useState<string>("");
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]); // State to hold fetched files

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Fetch the files when the component mounts
  useEffect(() => {
    if (courseId && user?.id) {
      getFiles();
    }
  }, [courseId, user?.id]);

  const getFiles = async () => {
    if (!user || !user.id) {
      setGetFilesStatus("User information is missing");
      return;
    }

    try {
      const response = await fetch("/api/getClassFiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          courseName: courseId, // Assuming courseId is actually the course name
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFiles(data.files); // Store the files in state
        setGetFilesStatus("Files fetched successfully");
      } else {
        setGetFilesStatus("Failed to fetch files");
      }
    } catch (error) {
      if (error instanceof Error) {
        setGetFilesStatus("Failed to fetch files: " + error.message);
      } else {
        setGetFilesStatus("Failed to fetch files: unknown error");
      }
    }
  };

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
        setUploadStatus("File uploaded successfully.");
        getFiles(); // Refresh the files after a successful upload
      } else {
        setUploadStatus("File upload failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setUploadStatus("File upload failed: " + error.message);
      } else {
        setUploadStatus("File upload failed: unknown error");
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-3 pt-6 justify-between">
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium">Uploaded Files</p>

        <ScrollArea className="w-full rounded-md border">
          <div className="p-4">
            {getFilesStatus && (
              <h4 className="mb-4 text-sm font-medium leading-none">{getFilesStatus}</h4>
            )}

            {/* Display files dynamically */}
            {files.length > 0 ? (
              files.map((file) => (
                <div key={file.id} className="text-sm mb-2">
                  {file.name}
                </div>
              ))
            ) : (
              <p>No files uploaded yet.</p>
            )}

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

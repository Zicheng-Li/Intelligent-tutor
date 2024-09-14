"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";

export default function Classroom() {
  const { user } = useUser();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [classes, setClasses] = useState<{ name: string; description: string }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (user) {
      fetch(`/api/getClasses?userId=${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setClasses(data);
        })
        .catch((error) => {
          console.error("Error fetching classes:", error);
        });
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (user) {
      try {
        const response = await fetch("/api/createClass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            code,
            description,
          }),
        });

        if (response.ok) {
          // Parse the response to get the newly created class
          const newClass = await response.json();

          // Update the classes state with the new class
          setClasses((prevClasses) => [...prevClasses, newClass]);

          // Clear form fields
          setCode("");
          setDescription("");

          // Close the dialog
          setDialogOpen(false);
        } else {
          console.error("Error creating class:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating class:", error);
      }
    }
  };

  const handleCardClick = (className: string) => {
    router.push(`/${className}`); // Navigate to the class page
  };

  return (
    <div className="relative flex flex-col w-full ">
      <p className="text-2xl p-4 pt-2 ml-10 mt-8 font-medium">My Classes</p>
      <div className="grid grid-cols-3 gap-4 p-14 pt-7 gap-y-7">
        {classes.map((cls, index) => (
          <Card
            key={index}
            
          >
            <CardHeader>
              <CardTitle className="w-full cursor-pointer" // Add cursor-pointer for visual indication
            onClick={() => handleCardClick(cls.name)} // Handle card click
              >{cls.name}</CardTitle>
              <CardDescription>{cls.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-12 right-24">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="p-4 bg-blue-500 rounded-full text-white"
              onClick={() => setDialogOpen(true)}
            >
              <Plus size={24} />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new class</DialogTitle>
              <DialogDescription>
                Please enter your class code and class description
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-left whitespace-nowrap">
                  Enter class code
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="description"
                  className="text-right whitespace-nowrap"
                >
                  Enter description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
                <Button type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

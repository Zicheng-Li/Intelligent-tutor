
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
export default function FilesUpload() {
  
  return (
      <div className="flex flex-col h-full p-4 gap-3 pt-6 justify-between">
        <div className="flex flex-col gap-5">
          <p className="text-2xl font-medium">Uploaded Files</p>

          <ScrollArea className="w-full  rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Files</h4>

              <div className="text-sm">React files</div>
              <Separator className="my-2" />
              <div className="text-sm">Next js files</div>
              <Separator className="my-2" />
              <div className="text-sm">Python files</div>
              <Separator className="my-2" />
              <div className="text-sm">Java files</div>
              <Separator className="my-2" />
              <div className="text-sm">Math 101</div>
              <Separator className="my-2" />
            </div>
          </ScrollArea>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5 mb-9">
          <Label htmlFor="picture">Upload files</Label>
          <Input id="picture" type="file" className="w-full" />
        </div>
      </div>
  
  );
}

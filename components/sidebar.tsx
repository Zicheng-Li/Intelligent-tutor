"use client";
import clsx from "clsx";
import Link from "next/link";
import { House } from "lucide-react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import {
  DraggablePanel,
  DraggablePanelProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
export default function Sidebar() {
  const pathname = usePathname();

  const store = useCreateStore();


  const control: DraggablePanelProps | any = useControls(
    {
      defaultExpand: true,
      destroyOnClose: false,
      expandable: true,
      maxWidth: 100,
      minHeight: {
        step: 1,
        value: 0,
      },
      minWidth: 90,
      mode: {
        options: ['fixed', 'float'],
        value: 'fixed',
      },
      pin: true,
      placement: {
        options: ['left', 'right', 'top', 'bottom'],
        value: 'left',
      },
      showHandlerWhenUnexpand: true,
    },
    { store },
  );
  return (
    <DraggablePanel {...control}>
    <div className="flex flex-col justify-between bg-white h-screen p-4 gap-3 pt-6">
      {/* Home Icon */}
      <ul className="space-y-4 w-full">
        <li>
          <Link
            key="home"
            href="/"
            className={clsx(
              "flex justify-center items-center py-2 px-4 rounded-lg text-lg font-medium", // Center icon
              pathname === "/" ? "bg-blue-500 text-white" : "hover:bg-sky-400"
            )}
          >
            <House size={32} /> {/* Increased icon size */}
          </Link>
        </li>
      </ul>

      {/* Header (UserButton) at the bottom */}
      <Header />
    </div>
    </DraggablePanel>
  );
}

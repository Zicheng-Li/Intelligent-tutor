import { Loader } from "lucide-react";

export default function Loading() {
	// Or a custom loading skeleton component
	return (
		<div className="flex items-center justify-center w-screen h-screen">
		  {/* Lucide Loader icon with spin animation */}
		  <Loader className="animate-spin" size={40} strokeWidth={2} />
		</div>
	  );
  }
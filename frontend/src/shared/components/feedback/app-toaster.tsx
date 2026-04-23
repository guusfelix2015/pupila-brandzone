import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      expand={false}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "!rounded-[14px] !border !border-white/10 !bg-[#131417] !text-white !shadow-lg !shadow-black/35 !backdrop-blur",
          title: "!text-sm !font-semibold !text-white",
          description: "!text-xs !text-white/72",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-white/10 !text-white",
          closeButton: "!bg-transparent !text-white/60",
          success: "!border-accent/30",
          error: "!border-destructive/40",
        },
      }}
    />
  );
}

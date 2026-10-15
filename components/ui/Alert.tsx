import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

type AlertProps = {
  tone?: "error" | "success";
  children: React.ReactNode;
};

export function Alert({ tone = "error", children }: AlertProps) {
  const isError = tone === "error";
  const Icon = isError ? FiAlertCircle : FiCheckCircle;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-[14px] border px-3.5 py-3 text-sm font-semibold ${
        isError
          ? "border-danger/35 bg-danger/10 text-[#FFB3B3]"
          : "border-accent/35 bg-accent/10 text-accent"
      }`}
    >
      <Icon size={18} className="mt-px flex-none" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

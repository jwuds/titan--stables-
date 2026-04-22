import React from 'react';
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: 
          "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600 dark:bg-green-900/20 dark:text-green-200",
        error:
          "border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600 dark:bg-red-900/20 dark:text-red-200",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-200",
        info:
          "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600 dark:bg-blue-900/20 dark:text-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const icons = {
  default: Info,
  destructive: AlertCircle,
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const Alert = React.forwardRef(({ className, variant = "default", title, children, icon, ...props }, ref) => {
  const IconComponent = icon || icons[variant] || icons.default;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <IconComponent className="h-4 w-4" />
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm [&_p]:leading-relaxed">{children}</div>
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
export default Alert;
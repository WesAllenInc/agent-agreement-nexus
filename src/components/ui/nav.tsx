import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Nav({ className, ...props }: NavProps) {
  return (
    <nav className={cn("grid items-start gap-2", className)} {...props}>
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start"
        )}
      >
        Home
      </Link>
      <Link
        to="/agreements"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start"
        )}
      >
        Agreements
      </Link>
      <Link
        to="/settings"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start"
        )}
      >
        Settings
      </Link>
    </nav>
  )
}

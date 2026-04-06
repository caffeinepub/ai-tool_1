import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Bell, LogIn, LogOut, Moon, PenLine, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Header() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "";

  return (
    <header
      data-ocid="app.section"
      className="flex h-14 shrink-0 items-center justify-between border-b border-navy-border bg-navy-deep px-5 shadow-navy"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/20">
          <PenLine className="h-4 w-4 text-brand-orange" />
        </div>
        <div>
          <span className="text-lg font-bold text-brand-orange">लेखन</span>
          <span className="text-lg font-bold"> मित्र</span>
        </div>
        <div className="ml-1 hidden rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2 py-0.5 text-[10px] font-medium text-brand-orange sm:block">
          AI टूल
        </div>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        {["मुख्यपृष्ठ", "माझी पत्रे", "मदत"].map((item) => (
          <button
            type="button"
            key={item}
            data-ocid="nav.link"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark((d) => !d)}
                data-ocid="theme.toggle"
                className="h-8 w-8 text-muted-foreground hover:bg-navy-surface hover:text-foreground"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-navy-border bg-navy-surface text-xs">
              {isDark ? "प्रकाश मोड" : "डार्क मोड"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          size="icon"
          data-ocid="notifications.button"
          className="relative h-8 w-8 text-muted-foreground hover:bg-navy-surface hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-orange" />
        </Button>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid="user.button"
                className="flex items-center gap-2 rounded-lg border border-navy-border bg-navy-surface px-2.5 py-1.5 text-xs transition-colors hover:border-brand-orange/50"
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-brand-orange/20 text-[9px] text-brand-orange">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{shortPrincipal}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-navy-border bg-navy-surface"
            >
              <DropdownMenuItem
                onClick={clear}
                data-ocid="user.logout.button"
                className="cursor-pointer gap-2 text-xs hover:bg-navy-panel focus:bg-navy-panel"
              >
                <LogOut className="h-3.5 w-3.5" />
                लॉग आउट
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            size="sm"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            data-ocid="auth.primary_button"
            className={cn(
              "h-8 bg-brand-orange px-3 text-xs font-semibold text-white hover:bg-brand-orange-hover",
              (isLoggingIn || isInitializing) && "opacity-70",
            )}
          >
            {isLoggingIn ? (
              "लॉगिन..."
            ) : (
              <>
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                लॉगिन
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}

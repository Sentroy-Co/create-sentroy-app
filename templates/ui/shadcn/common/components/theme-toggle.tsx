"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

// Toggles the `.dark` class on <html> and persists the choice. The no-flash
// script in app/layout.tsx applies the stored (or system) theme before paint.
export function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark")
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light")
    } catch {
      /* ignore */
    }
  }
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  )
}

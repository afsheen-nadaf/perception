"use client"

import * as React from "react"
import { LogOut, Sparkles, User, ChevronsUpDown } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function NavUser() {
  const { user, logout } = useAuth()

  // Guard clause to make sure we don't try to render an empty profile
  if (!user) return null

  // Create clean fallbacks for display values
  const displayName = user.displayName || "User Account"
  const displayEmail = user.email || ""
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      {/* Trigger: The clickable user item in the sidebar */}
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm outline-hidden transition-colors hover:bg-muted/50 data-open:bg-muted/50 cursor-pointer">
        <Avatar size="default">
          <AvatarImage src={user.photoURL || ""} alt={displayName} />
          <AvatarFallback className="font-medium">{initials || <User />}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-1 flex-col truncate">
          <span className="font-medium text-foreground leading-none mb-1">{displayName}</span>
          <span className="text-xs text-muted-foreground truncate leading-none">{displayEmail}</span>
        </div>
        
        <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground/70" />
      </DropdownMenuTrigger>

      {/* Menu Options Popover */}
      <DropdownMenuContent align="start" side="top" sideOffset={12} className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar size="sm">
              <AvatarImage src={user.photoURL || ""} alt={displayName} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-foreground leading-none mb-1">{displayName}</span>
              <span className="text-xs text-muted-foreground truncate">{displayEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <Sparkles className="mr-2 size-4 text-primary" />
          <span>Premium Features</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => logout()} 
          variant="destructive" 
          className="cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
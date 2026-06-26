"use client"

import { ChevronsUpDown, LogOut, Settings, UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const currentUser = {
  name: "Afsheen",
  email: "afsheen@perception.ai",
  avatar: "",
}

export function UserProfile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl border border-border glass p-2.5 text-left transition-all hover:border-primary/30 hover:glow-blue cursor-pointer">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback className="bg-primary/15 text-primary">{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-foreground">{currentUser.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{currentUser.email}</p>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={10} className="w-60 glass">
        <div className="flex items-center gap-3 px-1.5 py-2">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/15 text-primary">{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">{currentUser.name}</p>
            <p className="truncate text-[11px] font-normal text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer"><UserRound className="h-4 w-4" aria-hidden="true" />Profile</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer"><Settings className="h-4 w-4" aria-hidden="true" />Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-negative focus:text-negative"><LogOut className="h-4 w-4" aria-hidden="true" />Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import AdminTitle from "./AdminTitle"
import { EditAgrichangeForm } from "@/app/(admin)/add-agrichange/_components/EditAgrichangeForm"
import { AgriChangeType, AgriQuestType } from "@/lib/types"
import { EditAgriquestForm } from "@/app/(admin)/add-agriquest/_components/EditAgriquestForm"

type Props = {
    agrichange?: AgriChangeType;
    agriquest?: AgriQuestType;
    title: string;
}

export const EditModules = ({
    agrichange,
    agriquest,
    title,
}: Props) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false)

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditorOpen(true)}>
                        Edit
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="lg:max-w-screen-lg max-lg:overflow-y-scroll max-h-screen">
                    <DialogHeader>
                        <DialogTitle>
                            <AdminTitle entry="1" title={title} />
                            {/* <p className="text-center">Status: {donationStatus}</p> */}
                        </DialogTitle>
                        <DialogDescription >
                            {agrichange ? (
                                <EditAgrichangeForm
                                    agrichange={agrichange as AgriChangeType}
                                />
                            ) : (
                                <EditAgriquestForm
                                    agriquest={agriquest as AgriQuestType}
                                />
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

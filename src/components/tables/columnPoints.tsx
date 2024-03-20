"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { TransactionWithUserAndPost } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columnPoints: ColumnDef<TransactionWithUserAndPost>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TRADE ID" />
            )
        },
        cell: ({ row }) => {
            const id = row.original.id

            return <div
                className=""
            >
                {id}
            </div>
        },
    },
    {
        accessorKey: "user",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="NAME" />
            )
        },
        cell: ({ row }) => {
            const name = row.original.user.name
            const lastName = row.original.user.lastName

            return <div
                className=""
            >
                {name} {" "} {lastName}
            </div>
        }
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ACTIVITY" />
            )
        },
        cell: ({ row }) => {
            const type = row.original.type

            const formattedType = type === "DONATE" ? "Donation" : type === "TRADE" ? "Trading" : ""

            return <div
                className=""
            >
                {formattedType}
            </div>
        },
    },
    {
        accessorKey: "points",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="GAINED POINTS" />
            )
        },
        cell: ({ row }) => {
            const points = row.original.points

            return <div
                className=""
            >
                {points} Points
            </div>
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="DATE" />
            )
        },
        cell: ({ row }) => {
            const date = row.original.createdAt

            return <div
                className=""
            >
                {format(date, "PPP")}
            </div>
        },
    },
]
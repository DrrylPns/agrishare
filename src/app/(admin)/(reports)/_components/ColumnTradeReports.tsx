"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { TradesWithRelations } from "@/app/(trader-page)/agrifeed/_components/_types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const ColumnTradeReports: ColumnDef<TradesWithRelations>[] = [
    {
        accessorKey: "trd",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TRADE ID" />
            )
        },
        cell: ({ row }) => {
            const id = row.original.trd

            return <div
                className=""
            >
                {id}
            </div>
        },
    },
    {
        accessorKey: "trader",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TRADER" />
            )
        },
        cell: ({ row }) => {
            const user = row.original.trader.name

            return <div
                className=""
            >
                {user}
            </div>
        },
    },
    {
        accessorKey: "item",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ITEM 1" />
            )
        },
        cell: ({ row }) => {
            const item = row.original.item

            return <div
                className=""
            >
                {item}
            </div>
        },
    },
    {
        accessorKey: "tradedQuantity",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Quantity" />
            )
        },
        cell: ({ row }) => {
            const traderQty = row.original.tradedQuantity
            const unit = row.original.category

            return <div
                className=""
            >
                {traderQty} {unit === "FRESH_FRUIT" || unit === "VEGETABLES" ? "Kilo/s" : unit === "TOOLS" || unit === "EQUIPMENTS" ? "Piece/s" : "Pack/s"}
            </div>
        },
    },
    {
        accessorKey: "tradee",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TRADEE" />
            )
        },
        cell: ({ row }) => {
            const user = row.original.tradee.name

            return <div
                className=""
            >
                {user}
            </div>
        },
    },
    {
        accessorKey: "post",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ITEM 2" />
            )
        },
        cell: ({ row }) => {
            const item = row.original.post.name

            return <div
                className=""
            >
                {item}
            </div>
        },
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Quantity" />
            )
        },
        cell: ({ row }) => {
            const tradeeQty = row.original.quantity
            const unit = row.original.post.category
            // todo unit of qty
            return <div
                className=""
            >
                {tradeeQty} {unit === "FRESH_FRUIT" || unit === "VEGETABLES" ? "Kilo/s" : unit === "TOOLS" || unit === "EQUIPMENTS" ? "Piece/s" : "Pack/s"}
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
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="STATUS" />
            )
        },
        cell: ({ row }) => {
            const status = row.original.status

            return <div
                className=""
            >
                {status}
            </div>
        },
    },
]
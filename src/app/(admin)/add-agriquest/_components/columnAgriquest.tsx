"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { EditModules } from "@/components/EditModules"
import { AgriChangeType, AgriQuestType } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columnAgriquest: ColumnDef<AgriQuestType>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="NAME" />
            )
        },
        cell: ({ row }) => {

            const name = row.original.name


            return <div
                className=""
            >
                {name}
            </div>
        },
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="CATEGORY" />
            )
        },
        cell: ({ row }) => {
            const category = row.original.category;
            let transformedCategory = "";

            switch (category) {
                case "FRESH_FRUIT":
                    transformedCategory = "Fresh Fruit";
                    break;
                case "EQUIPMENTS":
                    transformedCategory = "Equipments";
                    break;
                case "FERTILIZER":
                    transformedCategory = "Fertilizer";
                    break;
                case "SEEDS":
                    transformedCategory = "Seeds";
                    break;
                case "SOILS":
                    transformedCategory = "Soils";
                    break;
                case "TOOLS":
                    transformedCategory = "Tools";
                    break;
                case "VEGETABLES":
                    transformedCategory = "Vegetables";
                    break;
                default:
                    transformedCategory = "";
                    break;
            }

            return <div
                className=""
            >
                {transformedCategory}
            </div>
        }
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="QUANTITY" />
            )
        },
        cell: ({ row }) => {
            const qty = row.original.quantity


            return <div
                className=""
            >
                {qty}
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
        accessorKey: "actions",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ACTIONS" />
            )
        },
        cell: ({ row }) => {

            const id = row.original.id

            const agriquest = row.original


            return (
                <EditModules
                    key={id}
                    title="Edit agriquest"
                    agriquest={agriquest}
                />
            )
        }
    },
]
"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { EditModules } from "@/components/EditModules"
import { AgriChangeType } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columnAgrichange: ColumnDef<AgriChangeType>[] = [
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
        accessorKey: "pointsNeeded",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="POINTS TO CLAIM" />
            )
        },
        cell: ({ row }) => {
            const pts = row.original.pointsNeeded.toFixed(0)

            return <div
                className=""
            >
                {pts}
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

            const agrichange = row.original

            return (
                <EditModules
                    key={id}
                    title="Edit agrichange"
                    agrichange={agrichange}
                />
            )
        }
    },
]
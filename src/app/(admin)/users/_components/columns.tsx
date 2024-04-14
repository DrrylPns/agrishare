"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { categories } from "@/lib/utils"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "userId",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="User ID" />
            )
        },
        cell: ({ row }) => {
            const id = row.original.userId

            return <div
                className=""
            >
                {id}
            </div>
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Name" />
            )
        },
        cell: ({ row }) => {
            const name = row.original.name
            const lastName = row.original.lastName

            const words = name?.split(' ');

            const formattedName = words
                ?.map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
                .join(' ');

            return <div
                className=""
            >
                {formattedName} {" "} {lastName}
            </div>
        },
    },
    // {
    //     accessorKey: "role",
    //     header: ({ column }) => {
    //         return (
    //             <DataTableColumnHeader column={column} title="Type" />
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const role = row.original.role

    //         const formattedRole = role === "DONATOR" ? "Non-Urban Farmer" : "Urban Farmer"

    //         return <div
    //             className=""
    //         >
    //             {role}
    //         </div>
    //     },
    // },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const category = categories.find(
                (category) => category.value === row.getValue("role")
            );

            if (!category) {
                return null;
            }

            return (
                <div className="flex w-[100px] items-center">
                    <span>{category.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Date Joined" />
            )
        },
        cell: ({ row }) => {
            const dateJoined = row.original.createdAt

            return <div
                className=""
            >
                {format(dateJoined, "PPP")}
            </div>
        },
    },
]
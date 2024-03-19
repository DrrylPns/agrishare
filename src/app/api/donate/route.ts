import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { auth } from "../../../../auth";

export async function POST(req: Request) {
    try {
      
    } catch (error) {
        return new NextResponse(`Error: ${error}`, { status: 500 })
    }
}
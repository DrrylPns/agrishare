import prisma from "@/lib/db";
import { ChangePasswordSchema } from "@/lib/validations/user-settings";
import bcryptjs from "bcryptjs"
import { z } from "zod";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
    try {
      const session = await auth()
  
      if (!session?.user && !session) {
        return new Response("Error: No session found!", { status: 401 })
      }
  
      const body = await req.json();
  
      const { oldPassword, newPassword, confirmNewPassword } = ChangePasswordSchema.parse(body)
  
      const user = await prisma.user.findFirst({
        where: { id: session?.user.id }
      })
  
      const passwordMatch = await bcryptjs.compare(oldPassword, user?.hashedPassword as string);
  
      if (!passwordMatch) {
        return new Response("Old password is incorrect", { status: 400 })
      }
  
      const hashedNewPassword = await bcryptjs.hash(newPassword, 12);
  
      await prisma.user.update({
        where: { id: user?.id },
        data: {
          hashedPassword: hashedNewPassword
        }
      })
  
      return new Response("Password Updated Successfully", { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response("Invalid POST request data passed", { status: 422 })
      }
  
      return new Response("Could not create a user, please try again later!" + error, { status: 500 });
    }
  }
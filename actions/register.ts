"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";


import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/lib/validations/auth";
import { getUserByEmail } from "../data/user";
import prisma from "@/lib/db";
import { generateUserId } from "@/lib/utils";

export const register = async (values: z.infer<typeof RegisterSchema>, barangay: string, district: string, city: string, street: string) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  if (!district) {
    return { error: "Invalid district input!" }
  }

  if (!barangay) {
    return { error: "Invalid barangay input!" }
  }

  const { email, password, name, lastName, } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const userId = await generateUserId()

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword: hashedPassword,
      lastName,
      // country,
      // state,
      city,
      brgy: barangay,
      district,
      userId,
      street,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "Confirmation email sent!" };
};
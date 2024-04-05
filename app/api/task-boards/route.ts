import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

const createTaskBoardSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(25, "Title Field has a maximum of 25 characters"),
});

export async function POST(request: NextRequest | any) {
  const body = await request.json();
  const validation = createTaskBoardSchema.safeParse(body);
  console.log("HERE IS THE BODY", body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const newTaskBoard = await prisma.taskBoard.create({
    data: {
      title: body.title,
      createdBy: session.user.email,
    },
  });

  return NextResponse.json(newTaskBoard, { status: 201 });
}

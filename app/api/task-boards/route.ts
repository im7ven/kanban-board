import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { createTaskBoardSchema } from "../../validationSchemas";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const taskBoards = await prisma.taskBoard.findMany({
    where: {
      createdBy: session!.user!.email!,
    },
    include: {
      columns: true,
    },
  });

  if (!taskBoards) {
    return NextResponse.json({ status: 404 });
  }

  return NextResponse.json(taskBoards, { status: 200 });
}

export async function POST(request: NextRequest | any) {
  const body = await request.json();
  const validation = createTaskBoardSchema.safeParse(body);

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
      columns: {
        create:
          validation.data.columns?.map((columnName: string) => ({
            title: columnName,
          })) || [], // If validation.data.columns is undefined, use an empty array
      },
    },
    include: {
      columns: true,
    },
  });

  return NextResponse.json(newTaskBoard, { status: 201 });
}

import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskBoard = await prisma.taskBoard.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!taskBoard) {
    return NextResponse.json(
      { error: "Task board does not exist" },
      { status: 404 }
    );
  }

  await prisma.taskBoard.delete({
    where: { id: taskBoard.id },
  });

  return NextResponse.json({});
}

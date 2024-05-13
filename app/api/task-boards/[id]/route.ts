import { updateTaskBoardSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { error } from "console";
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const validation = updateTaskBoardSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const taskBoardId = parseInt(params.id);

  try {
    const existingTaskBoardState = await prisma.taskBoard.findUnique({
      where: { id: taskBoardId },
      include: { columns: true },
    });

    const existingColumnIds = existingTaskBoardState?.columns.map(
      (col) => col.id
    );
    const newColumnIds = validation.data.columns.map((col) => col.id);
    const columnsToDelete = existingColumnIds?.filter(
      (id) => !newColumnIds.includes(id)
    );

    await prisma.column.deleteMany({
      where: { id: { in: columnsToDelete } },
    });

    await prisma.taskBoard.update({
      where: { id: taskBoardId },
      data: {
        title: validation.data.title, // Update task board title
        columns: {
          // Update existing columns' titles
          updateMany: validation.data.columns
            .filter((column) => column.id !== undefined)
            .map((column) => ({
              where: { id: column.id },
              data: { title: column.title },
            })),
          // Create new columns
          create: validation.data.columns
            .filter((column) => column.id === undefined)
            .map((column) => ({
              title: column.title,
            })),
        },
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error("Error updating task board:", error);
    return NextResponse.json("Failed to update task board", { status: 500 });
  }
}

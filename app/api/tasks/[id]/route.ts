import { updateTaskSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const validation = updateTaskSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: parseInt(params.id) },
    include: { subtasks: true },
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const existingSubIds = existingTask.subtasks.map((sub) => sub.id);
  const newSubTaskIds = validation.data.subtasks?.map((sub) => sub.id) || [];

  const subTaskToDelete = existingSubIds.filter(
    (id) => !newSubTaskIds.includes(id)
  );

  console.log("Subtasks to delete:", subTaskToDelete);

  await prisma.subtask.deleteMany({
    where: { id: { in: subTaskToDelete } },
  });

  const updatedTask = await prisma.task.update({
    where: { id: parseInt(params.id) },
    data: {
      title: validation.data.title,
      description: validation.data.description,
      subtasks: {
        // Update existing subtasks
        updateMany: validation.data.subtasks
          .filter((sub) => sub.id !== undefined)
          .map((sub) => ({
            where: { id: sub.id },
            data: { description: sub.description },
          })),
        // Create new subtasks
        create: validation.data.subtasks
          .filter((sub) => sub.id === undefined)
          .map((sub) => ({
            description: sub.description,
            status: false,
          })),
      },
    },
  });

  return NextResponse.json(updatedTask);
}

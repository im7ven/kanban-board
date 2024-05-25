import { taskSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = taskSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const newTask = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      columnId: parseInt(body.columnId),
      subtasks: {
        create:
          validation.data.subtasks?.map((task: { title: string }) => ({
            description: task.title,
            status: false,
          })) || [],
      },
    },
  });

  return NextResponse.json(newTask, { status: 201 });
}

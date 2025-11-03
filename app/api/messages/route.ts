import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contact: true,
      },
      take: 50,
    });

    return Response.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = await prisma.message.create({
        data: {
        contactId: body.contactId,
        channel: body.channel || "sms",
        direction: body.direction || "outbound",
        content: body.content,
        status: "sent",
      },
    });

    return Response.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return Response.json({ error: "Failed to create message" }, { status: 500 });
  }
}
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { name: "asc" },
    });
    return new Response(JSON.stringify(contacts), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return new Response("Failed to fetch contacts", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, phone, email } = await request.json();
    const contact = await prisma.contact.create({
       data: { name, phone, email, },
    });
    return new Response(JSON.stringify(contact), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return new Response("Failed to create contact", { status: 500 });
  }
}

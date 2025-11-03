import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const actualParams = await params;
    const id = actualParams.id;
    console.log('id:', id)
    if (!id) return new Response("Missing ID", { status: 400 });

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) return new Response("Not found", { status: 404 });

    return new Response(JSON.stringify(contact), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return new Response("Failed to fetch contact", { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, phone, email } = await request.json();
    const actualParams = await params;
    const id = actualParams.id;
    const contact = await prisma.contact.update({
      where: { id: id },
       data: { name, phone, email, },
    });
    return new Response(JSON.stringify(contact), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return new Response("Failed to update contact", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const actualParams = await params;
    const id = actualParams.id;
    await prisma.contact.delete({
      where: { id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return new Response("Failed to delete contact", { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { twiml } from "twilio";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const body = formData.get("Body") as string;

    console.log(`Incoming message from ${from}: ${body}`);

    const phoneNumber = from.replace("whatsapp:", "");
    const channel = from.startsWith("whatsapp:") ? "whatsapp" : "sms";

    let contact = await prisma.contact.findFirst({
      where: {
        phone: phoneNumber,
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          name: phoneNumber,
          phone: phoneNumber,
        },
      });
    }

    await prisma.message.create({
       data: {
        contactId: contact.id,
        channel: channel,
        direction: "inbound",
        content: body,
        status: "received",
      },
    });

    console.log(`Message saved for contact: ${contact.name}`);

    const response = new twiml.MessagingResponse();
    response.message("Thanks for your message!");

    return new Response(response.toString(), {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return new Response("Failed to process message", { status: 500 });
  }
}

import { NextRequest } from "next/server";
import Twilio from "twilio";
import { PrismaClient } from "@prisma/client";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = Twilio(accountSid, authToken);
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, channel = "whatsapp", contactId } = body;

    let from = process.env.TWILIO_WHATSAPP_SANDBOX_NUMBER!;
    let twilioMessage;

    if (channel === "whatsapp") {
      twilioMessage = await client.messages.create({
        from: `whatsapp:${from}`,
        to: `whatsapp:${to}`,
        body: message,
      });
    } else {
      twilioMessage = await client.messages.create({
        from,
        to,
        body: message,
      });
    }

    let contact;
    if (contactId) {
      contact = await prisma.contact.findUnique({
        where: { id: contactId },
      });
    } else {
      contact = await prisma.contact.findFirst({
        where: { phone: to },
      });

      if (!contact) {
        contact = await prisma.contact.create({
           data: {
            name: to,
            phone: to,
          },
        });
      }
    }

    await prisma.message.create({
       data: {
        contactId: contact!.id,
        channel: channel,
        direction: "outbound",
        content: message,
        status: "sent",
      },
    });

    console.log(`Outbound message saved for contact: ${contact!.name}`);

    return new Response(JSON.stringify(twilioMessage), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response("Failed to send message", { status: 500 });
  }
}

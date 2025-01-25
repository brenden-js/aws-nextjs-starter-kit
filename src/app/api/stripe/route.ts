import {stripe} from "@/lib/stripe";
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {inngest} from "@/inngest/client";
import type {Stripe} from 'stripe';

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature")

  if (!signature) {
    return new NextResponse(`Unauthorized please add signature to request`, {status: 401})
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('Webhook successfully constructed event')
  } catch (error) {
    return new NextResponse(`Could not construct event ${JSON.stringify(error)}`, {status: 502})
  }

  if (event.type === 'checkout.session.completed') {
    const inngestFormatted = {
      id: event.data.object.id,
      subscription: event.data.object.subscription as string,
      metadata: event.data.object.metadata as {userId: string},
    }
    await inngest.send({name: "payments/checkout-session-completed", data: inngestFormatted})
    return new NextResponse(`Success`, {status: 200})
  }

  else if (event.type === 'invoice.paid') {
    const inngestFormatted = {
      id: event.data.object.id,
      subscription: event.data.object.subscription as string,
      metadata: event.data.object.metadata as {userId: string},
    }
    await inngest.send({name: "payments/invoice-paid", data: inngestFormatted})
    return new NextResponse(`Success`, {status: 200})
  }

  return new NextResponse(`Success`, {status: 200})
}
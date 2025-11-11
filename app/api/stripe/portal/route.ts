import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { createCustomerPortalSession, getUserSubscription } from "@/lib/stripe/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(session.user.id);

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portalSession = await createCustomerPortalSession(
      subscription.stripeCustomerId,
      `${baseUrl}/settings/subscription`
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}

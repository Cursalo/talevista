import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 stories per month",
      "10 images per month",
      "Basic story templates",
      "Community access",
    ],
    limits: {
      storiesPerMonth: 5,
      imagesPerMonth: 10,
      chaptersPerStory: 5,
    },
  },
  PRO: {
    name: "Pro",
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited stories",
      "100 images per month",
      "Advanced story templates",
      "Priority support",
      "Export to PDF",
      "No watermarks",
    ],
    limits: {
      storiesPerMonth: -1, // unlimited
      imagesPerMonth: 100,
      chaptersPerStory: 20,
    },
  },
  PREMIUM: {
    name: "Premium",
    price: 29.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Everything in Pro",
      "Unlimited images",
      "Custom AI models",
      "API access",
      "White-label export",
      "Dedicated support",
    ],
    limits: {
      storiesPerMonth: -1,
      imagesPerMonth: -1,
      chaptersPerStory: -1,
    },
  },
};

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: undefined, // Will be filled from user data
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getUserSubscription(userId: string) {
  const subscription = await prisma?.subscription.findUnique({
    where: {
      userId,
    },
  });

  return subscription;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return false;

  const isActive =
    subscription.status === "active" &&
    subscription.stripeCurrentPeriodEnd &&
    subscription.stripeCurrentPeriodEnd.getTime() > Date.now();

  return isActive;
}

export async function getUserPlan(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription || subscription.plan === "free") {
    return PLANS.FREE;
  }

  if (subscription.plan === "pro") {
    return PLANS.PRO;
  }

  if (subscription.plan === "premium") {
    return PLANS.PREMIUM;
  }

  return PLANS.FREE;
}

// Import prisma at the end to avoid circular dependency
import { prisma } from "@/lib/db/prisma";

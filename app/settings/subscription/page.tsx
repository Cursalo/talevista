"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Crown } from "lucide-react";
import Link from "next/link";
import { PLANS } from "@/lib/stripe/stripe";
import { useToast } from "@/components/ui/use-toast";

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchSubscription();
    }
  }, [status]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription");
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout",
        variant: "destructive",
      });
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      });
    }
  };

  const currentPlan = subscription?.plan || "free";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Subscription</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your subscription and billing
          </p>
        </div>

        {subscription && currentPlan !== "free" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                You're currently on the {currentPlan.toUpperCase()} plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Status</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {subscription.status}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Next Billing Date</div>
                  <div className="text-sm text-gray-600">
                    {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Button onClick={handleManageBilling} variant="outline" className="w-full">
                Manage Billing
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(PLANS).map(([key, plan]) => {
            const isCurrentPlan = currentPlan.toLowerCase() === key.toLowerCase();
            const isPro = key === "PRO";
            const isPremium = key === "PREMIUM";

            return (
              <Card key={key} className={isCurrentPlan ? "border-purple-500 border-2" : ""}>
                <CardHeader>
                  {isCurrentPlan && (
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                        Current Plan
                      </span>
                    </div>
                  )}
                  <CardTitle className="flex items-center gap-2">
                    {(isPro || isPremium) && <Crown className="w-5 h-5 text-yellow-500" />}
                    {plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {!isCurrentPlan && plan.priceId && (
                    <Button
                      onClick={() => handleUpgrade(plan.priceId!)}
                      className="w-full"
                      variant={isPremium ? "default" : "outline"}
                    >
                      {currentPlan === "free" ? "Upgrade" : "Change Plan"}
                    </Button>
                  )}

                  {isCurrentPlan && currentPlan !== "free" && (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  )}

                  {key === "FREE" && currentPlan === "free" && (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Need help choosing?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Contact our support team if you have questions about which plan is right for you.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </main>
    </div>
  );
}

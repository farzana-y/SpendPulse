import { Metadata } from "next";
import SharedResultClient from "./SharedResultClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://spend-pulse.vercel.app";

  try {
    const res = await fetch(`${baseUrl}/api/audits?id=${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const monthly = data.totalMonthlySavings ?? 0;
      const tools = data.toolNames ?? "AI tools";
      const title = monthly > 0
        ? `SpendPulse: $${monthly}/mo savings found on ${tools}`
        : `SpendPulse: AI spend audit for ${tools}`;
      const description = monthly > 0
        ? `This team could save $${monthly}/mo ($${monthly * 12}/yr) by optimizing their AI subscriptions.`
        : `AI spend audit results — stack looks well-optimized. Powered by SpendPulse.`;
      return {
        title,
        description,
        openGraph: { title, description, url: `${baseUrl}/results/${id}`, siteName: "SpendPulse", type: "website" },
        twitter: { card: "summary_large_image", title, description },
      };
    }
  } catch { /* fallback below */ }

  return {
    title: "SpendPulse — AI Spend Audit",
    description: "Find out where you're overspending on AI tools.",
    openGraph: { title: "SpendPulse — AI Spend Audit", description: "Find out where you're overspending on AI tools.", siteName: "SpendPulse" },
    twitter: { card: "summary_large_image", title: "SpendPulse — AI Spend Audit", description: "Find out where you're overspending on AI tools." },
  };
}

export default async function SharedResultPage({ params }: Props) {
  const { id } = await params;
  return <SharedResultClient id={id} />;
}

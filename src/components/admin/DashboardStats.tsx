
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Building, MailPlus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";

function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function getTrend(current: number, previous: number | undefined) {
  if (previous === undefined) return { direction: null, percent: 0 };
  if (previous === 0) return { direction: null, percent: 0 };
  const diff = current - previous;
  const percent = Math.abs(diff / previous) * 100;
  if (diff > 0) return { direction: "up", percent: percent };
  if (diff < 0) return { direction: "down", percent: percent };
  return { direction: null, percent: 0 };
}

export default function ModernStats() {
  // Real-time stats with refetch every 10s
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-modern-stats"],
    queryFn: async () => {
      // Fetch agents, offices, invitations
      const [agentsResult, officesResult, invitationsResult] = await Promise.all([
        supabase.from("sub_agents").select("count"),
        supabase.from("sub_offices").select("count"),
        supabase.from("profiles").select("count").eq("role", "sales_agent"),
      ]);
      // Agreements
      const { data: agreementsData, error: agreementsError } = await supabase
        .from("agreements")
        .select("id, status");
      if (agreementsError) throw agreementsError;
      // Signatures
      const { data: signaturesData, error: signaturesError } = await supabase
        .from("agreement_signatures")
        .select("id, agreement_id");
      if (signaturesError) throw signaturesError;
      const signedAgreementIds = new Set(signaturesData?.map((sig) => sig.agreement_id) || []);
      let pendingCount = 0;
      let signedCount = signedAgreementIds.size;
      let draftCount = 0;
      agreementsData?.forEach((agreement) => {
        if (signedAgreementIds.has(agreement.id)) {
        } else if (agreement.status === "submitted") {
          pendingCount++;
        } else if (agreement.status === "draft") {
          draftCount++;
        }
      });
      const totalAgreements = agreementsData?.length || 0;
      return {
        totalAgents: agentsResult.data?.[0]?.count || 0,
        totalAgreements,
        totalOffices: officesResult.data?.[0]?.count || 0,
        pendingInvitations: invitationsResult.data?.[0]?.count || 0,
        submittedAgreements: pendingCount,
        signedAgreements: signedCount,
        draftAgreements: draftCount,
        lastUpdated: format(new Date(), "PPpp"),
      };
    },
    refetchInterval: 10000,
  });

  // Track previous stats for trend indicators
  const prevStats = usePrevious(stats);

  // Memoize cards for performance
  const statsCards = useMemo(() => {
    if (!stats) return null;
    const cards = [
      {
        title: "Total Agents",
        value: stats.totalAgents,
        prev: prevStats?.totalAgents,
        description: "Sales agents onboarded",
        icon: <Users className="h-4 w-4 text-white/80" />,
        gradient: "from-blue-500 to-indigo-600",
      },
      {
        title: "Pending Invitations",
        value: stats.pendingInvitations,
        prev: prevStats?.pendingInvitations,
        description: "Awaiting acceptance",
        icon: <MailPlus className="h-4 w-4 text-white/80" />,
        gradient: "from-fuchsia-500 to-pink-500",
      },
      {
        title: "Total Offices",
        value: stats.totalOffices,
        prev: prevStats?.totalOffices,
        description: "Registered locations",
        icon: <Building className="h-4 w-4 text-white/80" />,
        gradient: "from-green-500 to-emerald-600",
      },
      {
        title: "Agreements",
        value: stats.totalAgreements,
        prev: prevStats?.totalAgreements,
        description: (
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>Signed: {stats.signedAgreements}</span>
            <span>Pending: {stats.submittedAgreements}</span>
            <span>Draft: {stats.draftAgreements}</span>
          </div>
        ),
        icon: <FileText className="h-4 w-4 text-white/80" />,
        gradient: "from-orange-500 to-yellow-500",
      },
    ];
    return cards.map((card, idx) => {
      const trend = getTrend(card.value, card.prev);
      return (
        <motion.div
          key={idx}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          whileHover={{ scale: 1.04 }}
          className={`relative rounded-xl shadow-lg overflow-hidden bg-gradient-to-br ${card.gradient} transition-transform duration-200 group`}
        >
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/60 to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10">
            <CardTitle className="text-sm font-medium text-white drop-shadow">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent className="z-10">
            <AnimatedNumber value={card.value} />
            {trend.direction && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${trend.direction === "up" ? "text-emerald-200" : "text-rose-200"}`}>
                {trend.direction === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {trend.percent.toFixed(1)}%
              </div>
            )}
            {typeof card.description === "string" ? (
              <p className="text-xs text-white/80 mt-1">{card.description}</p>
            ) : (
              card.description
            )}
          </CardContent>
        </motion.div>
      );
    });
  }, [stats, prevStats]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse"
            layout
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <p>Error loading dashboard statistics. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <AnimatePresence>{statsCards}</AnimatePresence>
    </div>
  );
}

// Animated number counter
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = usePrevious(value);
  useEffect(() => {
    if (prev === undefined || prev === value) {
      setDisplay(value);
      return;
    }
    let frame: number;
    const duration = 600;
    const start = prev;
    const end = value;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(start + (end - start) * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, prev]);
  return <span className="text-3xl font-bold text-white drop-shadow-lg">{display.toLocaleString()}</span>;
}

// ActivityTimeline component
export function ActivityTimeline() {
  // Fetch recent activities (agreements, agents, offices)
  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      // Get latest 10 activities from agreements, agents, offices
      const [agreements, agents, offices] = await Promise.all([
        supabase.from("agreements").select("id, title, created_at, status").order("created_at", { ascending: false }).limit(5),
        supabase.from("sub_agents").select("id, agent_name, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("sub_offices").select("id, office_name, created_at").order("created_at", { ascending: false }).limit(2),
      ]);
      // Merge and sort
      const activities = [
        ...(agreements.data || []).map((a: any) => ({
          type: "agreement",
          id: a.id,
          title: a.title || `Agreement #${a.id}`,
          status: a.status,
          created_at: a.created_at,
        })),
        ...(agents.data || []).map((a: any) => ({
          type: "agent",
          id: a.id,
          title: a.agent_name,
          created_at: a.created_at,
        })),
        ...(offices.data || []).map((o: any) => ({
          type: "office",
          id: o.id,
          title: o.office_name,
          created_at: o.created_at,
        })),
      ];
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return activities.slice(0, 10);
    },
    refetchInterval: 10000,
  });
  if (isLoading) return <div className="h-40 flex items-center justify-center text-muted-foreground">Loading activity...</div>;
  if (error) return <div className="text-destructive">Error loading activity.</div>;
  return (
    <div className="bg-background rounded-xl shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        <AnimatePresence>
          {data?.map((item: any, idx: number) => (
            <motion.li
              key={item.type + item.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full mt-1"
                style={{ background: item.type === "agreement" ? "#fbbf24" : item.type === "agent" ? "#6366f1" : "#10b981" }}
              />
              <span className="font-medium">
                {item.type === "agreement" && "Agreement"}
                {item.type === "agent" && "Agent"}
                {item.type === "office" && "Office"}
              </span>
              <span className="text-sm text-muted-foreground">
                {item.title}
                {item.status && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{item.status}</span>
                )}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {format(new Date(item.created_at), "PP p")}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

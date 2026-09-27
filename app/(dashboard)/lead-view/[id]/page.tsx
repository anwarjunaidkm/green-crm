import LeadViewContainer from "@/Containers/LeadViewContainer/LeadViewContainer";

interface LeadViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadViewPage({ params }: LeadViewPageProps) {
  const { id } = await params;

  return <LeadViewContainer leadId={id} />;
}

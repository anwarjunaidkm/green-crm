import UpdateLeadStatusContainer from "@/Containers/UpdateLeadStatusContainer/UpdateLeadStatusContainer";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateLeadStatusPage({ params }: PageProps) {
  const { id } = await params;

  return <UpdateLeadStatusContainer leadId={id} />;
}

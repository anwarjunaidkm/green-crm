import EditLeadContainer from "@/Containers/EditLeadContainer/EditLeadContainer";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLeadPage({ params }: PageProps) {
  const { id } = await params;

  return <EditLeadContainer leadId={id} />;
}

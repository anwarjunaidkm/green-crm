import StaffForm from "@/components/Staff/StaffForm";

interface EditStaffPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const resolvedParams = await Promise.resolve(params);
  return <StaffForm staffId={resolvedParams.id} />;
}

import StaffForm from "@/components/Staff/StaffForm";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StaffForm staffId={id} />;
}

import { redirect } from "next/navigation";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  redirect(`/catalog/p/${id}`);
}

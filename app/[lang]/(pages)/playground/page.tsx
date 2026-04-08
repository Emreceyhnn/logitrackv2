import { getDictionary } from "@/app/lib/language/language";

export default async function Playground({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return <h1>{dict.first.title}</h1>;
}

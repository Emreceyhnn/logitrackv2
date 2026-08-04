import VerifyEmailView from "@/app/components/forms/verifyEmailView";
import { verifyEmailToken } from "@/app/lib/controllers/users/emailVerification";

export default async function VerifyEmailPage({
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // Consume the token during render so the user lands on a finished result
  // rather than a page that asks them to click again.
  const result = token
    ? await verifyEmailToken(token)
    : { error: "Missing verification token." };

  const verified = Boolean(result && "success" in result && result.success);
  const alreadyVerified = Boolean(
    result && "alreadyVerified" in result && result.alreadyVerified
  );

  return (
    <VerifyEmailView verified={verified} alreadyVerified={alreadyVerified} />
  );
}

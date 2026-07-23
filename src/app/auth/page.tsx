"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, AuthHeading } from "@/components/auth/AuthShell";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/Button";
import { TextInput, Label } from "@/components/ui/Input";
import { api, ApiError } from "@/lib/api";
import { authorized, routeForStep, setSession } from "@/lib/session";

type Step = "email" | "login" | "otp" | "password" | "profile";

// The numbered progress dots only cover the new-user signup path.
const SIGNUP_STEPS: Step[] = ["email", "otp", "password", "profile"];
const RESEND_SECONDS = 32;

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step !== "otp" || secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  const signupIndex = SIGNUP_STEPS.indexOf(step);
  const showSteps = signupIndex !== -1;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const codeComplete = code.every((digit) => digit !== "");
  const nameValid = firstName.trim() !== "";
  const passwordValid = newPassword.length >= 8;

  const go = (next: Step) => {
    setError(null);
    setStep(next);
  };

  const goBack = () => {
    setError(null);
    switch (step) {
      case "email":
        return router.push("/");
      case "profile":
        return setStep("password");
      default:
        return setStep("email");
    }
  };

  const handle = async (fn: () => Promise<void>) => {
    setError(null);
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = (event: FormEvent) => {
    event.preventDefault();
    if (!emailValid) return;
    handle(async () => {
      const result = await api.start(email.trim());
      if (result.next === "LOGIN") {
        go("login");
      } else {
        setSecondsLeft(RESEND_SECONDS);
        go("otp");
      }
    });
  };

  const submitLogin = (event: FormEvent) => {
    event.preventDefault();
    if (password === "") return;
    handle(async () => {
      const result = await api.login(email.trim(), password);
      setSession(result);
      router.push(routeForStep(result.user.onboarding_step));
    });
  };

  const submitCode = (event?: FormEvent) => {
    event?.preventDefault();
    if (!codeComplete) return;
    handle(async () => {
      const result = await api.verify(email.trim(), code.join(""));
      setSession(result);
      go("password");
    });
  };

  const resend = () =>
    handle(async () => {
      await api.resendOtp(email.trim());
      setSecondsLeft(RESEND_SECONDS);
      setCode(Array(6).fill(""));
    });

  const submitPassword = (event: FormEvent) => {
    event.preventDefault();
    if (!passwordValid) return;
    handle(async () => {
      await authorized((token) => api.setPassword(newPassword, token));
      go("profile");
    });
  };

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    if (!nameValid) return;
    handle(async () => {
      await authorized((token) =>
        api.completeProfile(
          {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            username: username.trim(),
          },
          token,
        ),
      );
      router.push("/onboarding");
    });
  };

  return (
    <AuthShell
      steps={showSteps ? SIGNUP_STEPS.length : undefined}
      currentStep={showSteps ? signupIndex + 1 : undefined}
      onBack={goBack}
    >
      <div key={step} className="animate-rise">
        {step === "email" && (
          <form onSubmit={submitEmail} noValidate>
            <AuthHeading
              title="Start building your company’s brain"
              subtitle="Use your work email so we can connect you to the right organization."
            />

            <Label htmlFor="email">Work email</Label>
            <TextInput
              id="email"
              type="email"
              autoFocus
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <FormError error={error} />

            <Button type="submit" disabled={!emailValid || loading} className="mt-5 h-11 w-full">
              {loading ? "Please wait…" : "Continue"}
            </Button>

            <p className="mt-6 text-center text-[13px] leading-relaxed text-fg-subtle">
              By continuing you agree to our Terms and Privacy Policy.
            </p>
          </form>
        )}

        {step === "login" && (
          <form onSubmit={submitLogin}>
            <AuthHeading
              title="Welcome back"
              subtitle={
                <>
                  Enter your password for <span className="text-fg">{email.trim()}</span>
                </>
              }
            />

            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <FormError error={error} />

            <Button type="submit" disabled={password === "" || loading} className="mt-5 h-11 w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={submitCode}>
            <AuthHeading
              title="Check your inbox"
              subtitle={
                <>
                  We sent a 6-digit code to <span className="text-fg">{email.trim()}</span>
                </>
              }
            />

            <OtpInput value={code} onChange={setCode} onComplete={() => submitCode()} />

            <FormError error={error} />

            <Button type="submit" disabled={!codeComplete || loading} className="mt-6 h-11 w-full">
              {loading ? "Verifying…" : "Verify and continue"}
            </Button>

            <p className="mt-6 text-center text-[13px] text-fg-subtle">
              {secondsLeft > 0 ? (
                <>
                  Resend code in{" "}
                  <span className="nums text-fg-muted">
                    0:{String(secondsLeft).padStart(2, "0")}
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={resend}
                  disabled={loading}
                  className="rounded-badge text-accent transition-colors hover:text-accent-hover"
                >
                  Resend code
                </button>
              )}
            </p>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={submitPassword}>
            <AuthHeading
              title="Create a password"
              subtitle="Use at least 8 characters. You’ll use this to sign in next time."
            />

            <Label htmlFor="new-password">Password</Label>
            <TextInput
              id="new-password"
              type="password"
              autoFocus
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />

            <FormError error={error} />

            <Button type="submit" disabled={!passwordValid || loading} className="mt-5 h-11 w-full">
              {loading ? "Saving…" : "Continue"}
            </Button>
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={submitProfile}>
            <AuthHeading
              title="Almost there. Who are you?"
              subtitle="This is how teammates will see you across Vibino."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="first-name">First name</Label>
                <TextInput
                  id="first-name"
                  autoFocus
                  autoComplete="given-name"
                  placeholder="Ada"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last-name">Last name</Label>
                <TextInput
                  id="last-name"
                  autoComplete="family-name"
                  placeholder="Lovelace"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="username">Username</Label>
              <TextInput
                id="username"
                autoComplete="username"
                placeholder="ada (optional)"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <FormError error={error} />

            <Button type="submit" disabled={!nameValid || loading} className="mt-5 h-11 w-full">
              {loading ? "Saving…" : "Continue"}
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="mt-4 rounded-card border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[13px] text-danger">
      {error}
    </p>
  );
}

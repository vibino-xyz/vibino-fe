"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, AuthHeading } from "@/components/auth/AuthShell";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/Button";
import { TextInput, Label } from "@/components/ui/Input";

type Step = "email" | "otp" | "profile";

const STEP_ORDER: Step[] = ["email", "otp", "profile"];
const RESEND_SECONDS = 32;

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const stepIndex = STEP_ORDER.indexOf(step);

  useEffect(() => {
    if (step !== "otp" || secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  const goBack = () => {
    if (stepIndex === 0) return router.push("/");
    setStep(STEP_ORDER[stepIndex - 1]);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const codeComplete = code.every((digit) => digit !== "");
  const nameValid = firstName.trim() !== "" && lastName.trim() !== "";

  const submitEmail = (event: FormEvent) => {
    event.preventDefault();
    if (!emailValid) return;
    setSecondsLeft(RESEND_SECONDS);
    setStep("otp");
  };

  const submitCode = (event: FormEvent) => {
    event.preventDefault();
    if (!codeComplete) return;
    setStep("profile");
  };

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    if (!nameValid) return;
    router.push("/onboarding");
  };

  return (
    <AuthShell steps={3} currentStep={stepIndex + 1} onBack={goBack}>
      {/* key remounts the panel so each step animates in on its own */}
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

            <Button
              type="submit"
              disabled={!emailValid}
              className="mt-5 h-11 w-full"
            >
              Continue
            </Button>

            <p className="mt-6 text-center text-[13px] leading-relaxed text-fg-subtle">
              By continuing you agree to our Terms and Privacy Policy.
            </p>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={submitCode}>
            <AuthHeading
              title="Check your inbox"
              subtitle={
                <>
                  We sent a 6-digit code to{" "}
                  <span className="text-fg">{email.trim()}</span>
                </>
              }
            />

            <OtpInput
              value={code}
              onChange={setCode}
              onComplete={() => setStep("profile")}
            />

            <Button
              type="submit"
              disabled={!codeComplete}
              className="mt-6 h-11 w-full"
            >
              Verify and continue
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
                  onClick={() => setSecondsLeft(RESEND_SECONDS)}
                  className="rounded-badge text-accent transition-colors hover:text-accent-hover"
                >
                  Resend code
                </button>
              )}
            </p>
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

            <Button
              type="submit"
              disabled={!nameValid}
              className="mt-5 h-11 w-full"
            >
              Continue
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

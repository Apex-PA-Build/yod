import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Prose } from "@/components/prose";
import { storeConfig } from "@/shared/store-config";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy policy" current="Privacy policy" description="[Last updated: date]" />
      <div className="container-page pb-24">
        <Prose>
          <p>
            <strong>[Template: have this reviewed by a lawyer before launch.]</strong>
          </p>
          <h2>What we collect</h2>
          <ul>
            <li>Account details: your name, email address and password (stored hashed).</li>
            <li>Order details: delivery address, phone number and the items you buy.</li>
            <li>Reviews, photos and messages you choose to send us.</li>
            <li>Newsletter sign-ups: your email address.</li>
          </ul>
          <h2>How we use it</h2>
          <p>
            To deliver your orders, run your account, answer your messages and, if you opt in, email you about
            new drops.
          </p>
          <h2>Who we share it with</h2>
          <p>
            Delivery partners (to ship your order) and the service providers that host our store and send
            email. We don&apos;t sell your data.
          </p>
          <h2>Your choices</h2>
          <p>
            You can unsubscribe from emails at any time and ask us to access, correct or delete your data by
            writing to {storeConfig.contact.email}.
          </p>
        </Prose>
      </div>
    </>
  );
}

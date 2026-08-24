import type { CSSProperties, ReactNode } from "react";

import {
  getPartnerAvailabilityLabel,
  getProjectTimelineLabel,
} from "@/lib/constants/inquiries";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import type { Inquiry } from "@/lib/validations/inquiries";

const bodyStyle: CSSProperties = {
  backgroundColor: "#08090d",
  color: "#f5f7ff",
  fontFamily: "Arial, sans-serif",
  margin: 0,
  padding: "32px 16px",
};

const cardStyle: CSSProperties = {
  backgroundColor: "#11131b",
  border: "1px solid #292d3d",
  borderRadius: "16px",
  margin: "0 auto",
  maxWidth: "640px",
  overflow: "hidden",
};

function DetailRow({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <tr>
      <th
        style={{
          borderBottom: "1px solid #292d3d",
          color: "#9ca3b7",
          fontSize: "12px",
          padding: "14px 20px",
          textAlign: "left",
          verticalAlign: "top",
          width: "160px",
        }}
      >
        {label}
      </th>
      <td
        style={{
          borderBottom: "1px solid #292d3d",
          color: "#f5f7ff",
          fontSize: "14px",
          lineHeight: 1.6,
          padding: "14px 20px",
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </td>
    </tr>
  );
}

export function InquiryNotificationEmail({
  inquiry,
  inquiryId,
}: {
  inquiry: Inquiry;
  inquiryId: string;
}) {
  const services = inquiry.serviceIds
    .map(
      (serviceId) =>
        SERVICE_CATALOG.find((service) => service.id === serviceId)?.title,
    )
    .filter((title): title is string => Boolean(title));

  return (
    <html lang="en">
      <body style={bodyStyle}>
        <div style={cardStyle}>
          <div
            style={{
              background: "linear-gradient(135deg, #3157ff, #854dff)",
              padding: "24px 20px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                margin: "0 0 8px",
                textTransform: "uppercase",
              }}
            >
              AY Media Work website
            </p>
            <h1 style={{ fontSize: "24px", margin: 0 }}>
              New {inquiry.type} inquiry
            </h1>
          </div>

          <table
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <tbody>
              <DetailRow label="Reference">{inquiryId}</DetailRow>
              <DetailRow label="Name">{inquiry.name}</DetailRow>
              <DetailRow label="Email">{inquiry.email}</DetailRow>
              <DetailRow label="Contact number">
                {inquiry.contactNumber || "Not provided"}
              </DetailRow>
              {inquiry.type === "client" ? (
                <>
                  <DetailRow label="Company / brand">
                    {inquiry.companyBrand || "Not provided"}
                  </DetailRow>
                  <DetailRow label="Preferred timeline">
                    {getProjectTimelineLabel(inquiry.preferredTimeline)}
                  </DetailRow>
                  <DetailRow label="Project brief">{inquiry.brief}</DetailRow>
                </>
              ) : (
                <>
                  <DetailRow label="Specialty">{inquiry.specialty}</DetailRow>
                  <DetailRow label="Portfolio">
                    <a href={inquiry.portfolioUrl} style={{ color: "#9db2ff" }}>
                      {inquiry.portfolioUrl}
                    </a>
                  </DetailRow>
                  <DetailRow label="Availability">
                    {getPartnerAvailabilityLabel(inquiry.availability)}
                  </DetailRow>
                  <DetailRow label="Collaboration message">
                    {inquiry.collaborationMessage}
                  </DetailRow>
                </>
              )}
              <DetailRow label="Services">{services.join(", ")}</DetailRow>
              <DetailRow label="Newsletter">
                {inquiry.newsletterConsent ? "Opted in" : "Not requested"}
              </DetailRow>
            </tbody>
          </table>

          <p
            style={{
              color: "#9ca3b7",
              fontSize: "12px",
              lineHeight: 1.6,
              margin: 0,
              padding: "18px 20px 22px",
            }}
          >
            This notification contains personal data. Keep it within the
            authorised AY Media Work team and manage the inquiry in the secure
            dashboard when available.
          </p>
        </div>
      </body>
    </html>
  );
}

export function getInquiryNotificationText(
  inquiry: Inquiry,
  inquiryId: string,
) {
  const services = inquiry.serviceIds
    .map(
      (serviceId) =>
        SERVICE_CATALOG.find((service) => service.id === serviceId)?.title,
    )
    .filter((title): title is string => Boolean(title))
    .join(", ");
  const common = [
    `New ${inquiry.type} inquiry`,
    `Reference: ${inquiryId}`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Contact number: ${inquiry.contactNumber || "Not provided"}`,
    `Services: ${services}`,
    `Newsletter: ${inquiry.newsletterConsent ? "Opted in" : "Not requested"}`,
  ];
  const details =
    inquiry.type === "client"
      ? [
          `Company / brand: ${inquiry.companyBrand || "Not provided"}`,
          `Preferred timeline: ${getProjectTimelineLabel(inquiry.preferredTimeline)}`,
          `Project brief:\n${inquiry.brief}`,
        ]
      : [
          `Specialty: ${inquiry.specialty}`,
          `Portfolio: ${inquiry.portfolioUrl}`,
          `Availability: ${getPartnerAvailabilityLabel(inquiry.availability)}`,
          `Collaboration message:\n${inquiry.collaborationMessage}`,
        ];

  return [...common, ...details].join("\n\n");
}

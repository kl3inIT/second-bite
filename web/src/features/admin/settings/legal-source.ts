import "server-only";

export type LegalKind = "terms" | "privacy" | "sellerRules";
export type LegalStatus = "active" | "draft" | "replaced";

export type LegalDocument = {
  id: string;
  kind: LegalKind;
  version: string;
  /** The day it takes effect; none for a draft without one. */
  effectiveFrom?: string;
  status: LegalStatus;
};

export type LegalDraft = {
  kind: LegalKind;
  version: string;
  body: string;
  effectiveFrom?: string;
  savedAt?: string;
  /** Whether people must agree again once it takes effect. */
  reconsent: boolean;
};

export type LegalContent = { documents: LegalDocument[]; draft: LegalDraft | null };

/**
 * The versions of the terms and policies. They are written in the web's code today (features/legal), not kept by a
 * module, so there are none here; the page shows its empty state until legal content has a backend.
 */
export async function listLegalDocuments(): Promise<LegalContent> {
  return { documents: [], draft: null };
}

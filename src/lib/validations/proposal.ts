import { z } from "zod";

export const ProposalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.object({
    leadName: z.string().min(1, "Lead name is required"),
    companyName: z.string().min(1, "Company name is required"),
    email: z.string().email("Invalid email"),
    currency: z.string().min(1).default("USD"),
  }),
  scope: z.object({
    workstreams: z.array(z.string()),
    executiveFocus: z.string().min(10, "Please provide a detailed focus"),
  }),
  pricing: z.array(z.object({
    id: z.string(),
    item: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    amount: z.number().min(0),
  })),
  timeline: z.array(z.object({
    phase: z.string(),
    weeks: z.string(),
    description: z.string(),
  })),
  terms: z.string().min(1, "Terms are required"),
});

export type ProposalValues = z.infer<typeof ProposalSchema>;

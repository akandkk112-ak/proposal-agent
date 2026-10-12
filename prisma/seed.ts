import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@proposalstudio.com" },
    update: {},
    create: {
      name: "Elena Vance",
      email: "demo@proposalstudio.com",
      password: hashedPassword,
      jobTitle: "Product Director",
      company: "Acme Agency",
    },
  });

  console.log("✅ Created demo user:", user.email);

  // Create demo clients
  const clients = [
    { name: "Elena Rostova", email: "e.rostova@starlight-arch.com", company: "Starlight Architecture", website: "starlight-arch.com", industry: "Architecture", status: "ACTIVE" },
    { name: "Julian Hayes", email: "j.hayes@vanguardre.com", company: "Vanguard Real Estate Group", website: "vanguardre.com", industry: "Real Estate", status: "ACTIVE" },
    { name: "Sophia Chen", email: "sophia@omnicreative.co", company: "Omni Creative Agency", website: "omnicreative.co", industry: "Agency", status: "ACTIVE" },
    { name: "Alexander Wright", email: "a.wright@kronapartners.com", company: "Krona Advisory & Partners", website: "kronapartners.com", industry: "Consulting", status: "ACTIVE" },
    { name: "Maya Patel", email: "mpatel@beaconhealth.io", company: "Beacon Health Technologies", website: "beaconhealth.io", industry: "Enterprise Tech", status: "PROSPECT" },
  ];

  const createdClients = [];
  for (const clientData of clients) {
    const client = await prisma.client.upsert({
      where: { id: `demo-client-${clientData.name.toLowerCase().replace(/\s/g, "-")}` },
      update: {},
      create: {
        id: `demo-client-${clientData.name.toLowerCase().replace(/\s/g, "-")}`,
        ...clientData,
        userId: user.id,
      },
    });
    createdClients.push(client);
    console.log("✅ Created client:", client.name);
  }

  // Create demo proposals
  const proposalData = [
    {
      title: "Cloud Architecture Modernization",
      status: "SIGNED",
      totalAmount: 145000,
      clientIndex: 0,
      content: JSON.stringify({
        clientName: "Elena Rostova",
        companyName: "Starlight Architecture",
        email: "e.rostova@starlight-arch.com",
        currency: "USD",
        scopeTags: ["Strategy", "Development"],
        executiveFocus: "Comprehensive cloud migration and modernization initiative.",
        pricingItems: [
          { id: "1", name: "Cloud Assessment & Planning", description: "Infrastructure audit and migration roadmap", amount: 45000 },
          { id: "2", name: "Migration Execution", description: "Lift-and-shift with modernization", amount: 75000 },
          { id: "3", name: "Post-Migration Support", description: "3-month hypercare and optimization", amount: 25000 },
        ],
        timeline: [
          { phase: "Phase 1", weeks: "Weeks 1-3", description: "Assessment & Planning" },
          { phase: "Phase 2", weeks: "Weeks 4-10", description: "Migration Execution" },
          { phase: "Phase 3", weeks: "Weeks 11-14", description: "Support & Optimization" },
        ],
        paymentTerms: "50% upfront, 50% upon project completion and sign-off.",
        executiveSummary: "Starlight Architecture requires a comprehensive cloud modernization strategy to support their growing portfolio. This proposal outlines our phased approach to migrating critical infrastructure while maintaining business continuity.",
      }),
    },
    {
      title: "Brand Identity & Design System 2.0",
      status: "UNDER_REVIEW",
      totalAmount: 68500,
      clientIndex: 1,
      content: JSON.stringify({
        clientName: "Julian Hayes",
        companyName: "Vanguard Real Estate Group",
        email: "j.hayes@vanguardre.com",
        currency: "USD",
        scopeTags: ["Visual Architecture", "Production Deliverables"],
        executiveFocus: "Complete brand overhaul and design system implementation.",
        pricingItems: [
          { id: "1", name: "Brand Strategy & Research", description: "Market positioning and competitive analysis", amount: 18500 },
          { id: "2", name: "Visual Identity Design", description: "Logo, typography, color system", amount: 32000 },
          { id: "3", name: "Design System Implementation", description: "Component library and documentation", amount: 18000 },
        ],
        timeline: [
          { phase: "Phase 1", weeks: "Weeks 1-4", description: "Strategy & Research" },
          { phase: "Phase 2", weeks: "Weeks 5-10", description: "Visual Identity" },
          { phase: "Phase 3", weeks: "Weeks 11-14", description: "System Implementation" },
        ],
        paymentTerms: "33% at start, 33% at visual identity approval, 34% at delivery.",
        executiveSummary: "Vanguard Real Estate Group seeks to establish a premium brand presence that reflects their market leadership. This engagement delivers a complete visual identity system built for long-term scalability.",
      }),
    },
    {
      title: "Q3 Strategic Growth Advisory",
      status: "DRAFT",
      totalAmount: 94000,
      clientIndex: 2,
      content: JSON.stringify({
        clientName: "Sophia Chen",
        companyName: "Omni Creative Agency",
        email: "sophia@omnicreative.co",
        currency: "USD",
        scopeTags: ["Strategy", "Consulting"],
        executiveFocus: "Strategic growth planning and market expansion.",
        pricingItems: [
          { id: "1", name: "Market Analysis & Opportunity Mapping", description: "Competitive landscape and growth vectors", amount: 24000 },
          { id: "2", name: "Strategic Roadmap Development", description: "90-day and annual execution plans", amount: 45000 },
          { id: "3", name: "Executive Advisory Retainer", description: "Monthly advisory sessions", amount: 25000 },
        ],
        timeline: [
          { phase: "Phase 1", weeks: "Weeks 1-3", description: "Market Analysis" },
          { phase: "Phase 2", weeks: "Weeks 4-8", description: "Roadmap Development" },
          { phase: "Phase 3", weeks: "Ongoing", description: "Advisory Retainer" },
        ],
        paymentTerms: "Monthly retainer billed at the first of each month.",
        executiveSummary: "Omni Creative Agency is positioned for significant growth in Q3. This advisory engagement provides the strategic framework and executive guidance needed to capture emerging market opportunities.",
      }),
    },
  ];

  for (let i = 0; i < proposalData.length; i++) {
    const data = proposalData[i];
    const proposal = await prisma.proposal.create({
      data: {
        title: data.title,
        reference: `PR-2025-${String(i + 1).padStart(3, "0")}`,
        status: data.status,
        totalAmount: data.totalAmount,
        currency: "USD",
        content: data.content,
        clientId: createdClients[data.clientIndex].id,
        userId: user.id,
        viewCount: Math.floor(Math.random() * 50),
      },
    });
    console.log("✅ Created proposal:", proposal.title);
  }

  // Create demo templates
  const templates = [
    { name: "Architectural & Interior RFP Proposal", category: "Architecture", description: "Comprehensive blueprint format with project schedule, render grids, fee matrix, legal annexes.", tags: JSON.stringify(["Milestone Gantt", "Phase Breakdown", "Legal Terms"]), rating: 4.9, usageCount: 420, isPublic: true },
    { name: "Agency Brand Identity & Digital Design", category: "Creative Agency", description: "Visual-first case study presentation with milestone roadmap and tiered pricing.", tags: JSON.stringify(["Tiered Matrix", "Deliverables Grid", "Sign-off Block"]), rating: 4.8, usageCount: 890, isPublic: true },
    { name: "Enterprise Management Consulting Retainer", category: "Consulting", description: "Objective-driven scope with stakeholder interview plan, SLA terms, governance protocols.", tags: JSON.stringify(["SLA Matrix", "Interview Protocol", "Retainer Calc"]), rating: 4.7, usageCount: 310, isPublic: true },
  ];

  for (const templateData of templates) {
    const template = await prisma.template.create({
      data: {
        ...templateData,
        structure: JSON.stringify({ blocks: [] }),
        userId: user.id,
      },
    });
    console.log("✅ Created template:", template.name);
  }

  // Create user settings
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      companyName: "Acme Agency",
      companyAddress: "580 Howard Street, Suite 400, San Francisco, CA 94105",
      currency: "USD",
      accentColor: "#7C3AED",
      pageFormat: "A4",
    },
  });

  console.log("✅ Created user settings");
  console.log("\n🎉 Database seeded successfully!");
  console.log("📧 Login: demo@proposalstudio.com");
  console.log("🔑 Password: demo1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

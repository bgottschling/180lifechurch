"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  checklistSections,
  type ChecklistItem,
} from "@/lib/checklist-data";

// Register fonts for a clean look
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf",
      fontWeight: 700,
    },
  ],
});

const amber = "#D4A054";
const charcoal = "#1A1A1A";
const lightGray = "#F5F3F0";
const medGray = "#6B5E57";

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: charcoal,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
  },
  // Header
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: amber,
    paddingBottom: 16,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "column",
  },
  churchName: {
    fontSize: 20,
    fontWeight: 700,
    color: charcoal,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: amber,
    fontWeight: 600,
    marginTop: 4,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 9,
    color: medGray,
  },
  progressText: {
    fontSize: 11,
    fontWeight: 600,
    color: amber,
    marginTop: 2,
  },
  // Instructions box
  instructionsBox: {
    backgroundColor: "#FDF8F0",
    borderWidth: 1,
    borderColor: "#E8D5B8",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: charcoal,
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 9.5,
    color: medGray,
    lineHeight: 1.6,
  },
  instructionsEmail: {
    fontSize: 10,
    fontWeight: 600,
    color: amber,
  },
  // Sections
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: charcoal,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: amber,
    marginRight: 10,
    width: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "white",
    flex: 1,
  },
  sectionCount: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
  },
  sectionDesc: {
    fontSize: 9,
    color: medGray,
    marginBottom: 10,
    fontStyle: "italic",
  },
  // Items
  itemRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE9E4",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  itemRowAlt: {
    backgroundColor: lightGray,
  },
  itemLabel: {
    flex: 1,
    fontSize: 9.5,
    color: charcoal,
    fontWeight: 600,
    paddingRight: 12,
  },
  itemValue: {
    flex: 1.2,
    fontSize: 9.5,
    color: charcoal,
  },
  itemEmpty: {
    flex: 1.2,
    fontSize: 9.5,
    color: "#B5ADA6",
    fontStyle: "italic",
  },
  // Cost section
  costBox: {
    backgroundColor: "#F0FAF0",
    borderWidth: 1,
    borderColor: "#C5E5C5",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  costTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: charcoal,
    marginBottom: 6,
  },
  costText: {
    fontSize: 9.5,
    color: medGray,
    lineHeight: 1.6,
  },
  costHighlight: {
    fontSize: 10,
    fontWeight: 700,
    color: "#2D7A2D",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EDE9E4",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#B5ADA6",
  },
});

function formatValue(
  item: ChecklistItem,
  value: string | boolean | string[] | undefined
): string {
  if (value === undefined || value === "" || value === false) return "";
  if (value === true) return "Yes";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

interface ChecklistPDFProps {
  values: Record<string, string | boolean | string[]>;
  progress: { total: number; completed: number };
}

export function ChecklistPDF({ values, progress }: ChecklistPDFProps) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.headerBar}>
          <View style={s.headerLeft}>
            <Text style={s.churchName}>180 Life Church</Text>
            <Text style={s.subtitle}>Discovery Checklist</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.dateText}>Generated {today}</Text>
            <Text style={s.progressText}>
              {progress.completed} of {progress.total} completed
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={s.instructionsBox}>
          <Text style={s.instructionsTitle}>
            What to do with this document
          </Text>
          <Text style={s.instructionsText}>
            This checklist captures the information we need to connect your new
            website to your existing WordPress setup and online tools. Please
            review your responses below, fill in anything you may have missed,
            and email this PDF to:
          </Text>
          <Text style={s.instructionsEmail}>
            {"\n"}bgottschling@gmail.com
          </Text>
          <Text style={s.instructionsText}>
            {"\n"}If anything is unclear or you need help gathering info, don't
            worry. We'll work through it together. Nothing here is set in
            stone.
          </Text>
        </View>

        {/* Sections */}
        {checklistSections.map((section, sIdx) => {
          const answered = section.items.filter((item) => {
            const v = values[item.id];
            return v !== undefined && v !== "" && v !== false;
          }).length;

          return (
            <View
              key={section.id}
              style={s.sectionContainer}
              wrap={false}
            >
              <View style={s.sectionHeader}>
                <Text style={s.sectionNumber}>{sIdx + 1}</Text>
                <Text style={s.sectionTitle}>{section.title}</Text>
                <Text style={s.sectionCount}>
                  {answered}/{section.items.length}
                </Text>
              </View>
              <Text style={s.sectionDesc}>{section.description}</Text>

              {section.items.map((item, iIdx) => {
                const display = formatValue(item, values[item.id]);
                return (
                  <View
                    key={item.id}
                    style={[
                      s.itemRow,
                      iIdx % 2 === 1 ? s.itemRowAlt : {},
                    ]}
                  >
                    <Text style={s.itemLabel}>{item.label}</Text>
                    {display ? (
                      <Text style={s.itemValue}>{display}</Text>
                    ) : (
                      <Text style={s.itemEmpty}>Not answered yet</Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Cost section */}
        <View style={s.costBox} wrap={false}>
          <Text style={s.costTitle}>About the Cost</Text>
          <Text style={s.costHighlight}>
            This website redesign is 100% free.{"\n"}
          </Text>
          <Text style={s.costText}>
            Brandon is doing this as a form of his ministry, completely pro
            bono. The design, development, deployment, and ongoing support are
            all donated at no cost to 180 Life Church.
          </Text>
          <Text style={s.costText}>
            {"\n"}The only costs to the church are the infrastructure you
            already have: your domain name (typically $10-15/year) and web
            hosting. We'll actively look for ways to minimize even those
            existing costs. If there are any optional tools that would enhance
            the site (like Advanced Custom Fields Pro at $49/year), we'll
            discuss those together and only add them if the value is clear.
          </Text>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            180 Life Church - Discovery Checklist
          </Text>
          <Text style={s.footerText}>
            Confidential - For internal use only
          </Text>
        </View>
      </Page>
    </Document>
  );
}

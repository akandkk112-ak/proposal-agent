"use client";

import { Slide, SlideElement, PresentationTheme } from "@/lib/presentation-types";

interface SlideRendererProps {
  slide: Slide;
  theme: PresentationTheme;
  scale?: number;
  isSelected?: boolean;
  isThumbnail?: boolean;
  onElementClick?: (elementId: string) => void;
}

interface ElProps {
  el: SlideElement;
  theme: PresentationTheme;
  mini: boolean;
  onElementClick?: (id: string) => void;
}

function ElementRenderer({ el, theme, mini, onElementClick }: ElProps) {
  const clickable = onElementClick
    ? { onClick: () => onElementClick(el.id), style: { cursor: "pointer" } }
    : {};

  switch (el.type) {
    case "heading":
      return (
        <h2
          {...clickable}
          style={{
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            fontWeight: el.isBold === false ? 400 : (el.isBold ? 900 : 800),
            fontStyle: el.isItalic ? "italic" : "normal",
            fontSize: mini ? 16 : theme.headingFontSize,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {el.content}
        </h2>
      );

    case "subheading":
      return (
        <p
          {...clickable}
          style={{
            color: theme.secondaryColor,
            fontFamily: theme.fontFamily,
            fontWeight: el.isBold === false ? 400 : (el.isBold ? 800 : 600),
            fontStyle: el.isItalic ? "italic" : "normal",
            fontSize: mini ? 9 : Math.round(theme.headingFontSize * 0.55),
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {el.content}
        </p>
      );

    case "paragraph":
      return (
        <p
          {...clickable}
          style={{
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            fontWeight: el.isBold ? 700 : 400,
            fontStyle: el.isItalic ? "italic" : "normal",
            fontSize: mini ? 7 : theme.bodyFontSize,
            lineHeight: 1.7,
            opacity: 0.85,
            margin: 0,
          }}
        >
          {el.content}
        </p>
      );

    case "bullet_list":
      return (
        <ul
          {...clickable}
          style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: mini ? 3 : 10 }}
        >
          {(el.items || []).map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: mini ? 4 : 10 }}>
              <span
                style={{
                  display: "block",
                  width: mini ? 4 : 7,
                  height: mini ? 4 : 7,
                  borderRadius: "50%",
                  backgroundColor: theme.primaryColor,
                  flexShrink: 0,
                  marginTop: mini ? 3 : 7,
                }}
              />
              <span
                style={{
                  color: theme.textColor,
                  fontSize: mini ? 7 : theme.bodyFontSize,
                  fontWeight: el.isBold ? 700 : 400,
                  fontStyle: el.isItalic ? "italic" : "normal",
                  lineHeight: 1.55,
                  fontFamily: theme.fontFamily,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <div
          {...clickable}
          style={{
            width: "100%",
            flex: 1,
            backgroundColor: "#F8FAFC",
            borderRadius: theme.borderRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: mini ? 40 : 200,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
          }}
        >
          {el.url ? (
            <img
              src={el.url}
              alt={el.alt || "Slide image"}
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "transform 0.5s ease" }}
            />
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: mini ? 12 : 32, marginBottom: 4, opacity: 0.5 }}>🖼</div>
              {!mini && (
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0, fontWeight: 500 }}>
                  {el.alt || "Image placeholder"}
                </p>
              )}
            </div>
          )}
        </div>
      );

    case "card":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(el.cards?.length || 3, 4)}, 1fr)`,
            gap: mini ? 6 : 24,
            width: "100%",
          }}
        >
          {(el.cards || []).map((card, i) => (
            <div
              key={i}
              style={{
                padding: mini ? 8 : 28,
                borderRadius: theme.borderRadius,
                backgroundColor: theme.backgroundColor === "#FFFFFF" ? "#FFFFFF" : theme.backgroundColor,
                border: theme.cardStyle === "outlined" ? `1px solid ${theme.primaryColor}33` : "1px solid #E2E8F0",
                boxShadow: theme.cardStyle === "elevated" ? "0 4px 20px -4px rgba(0,0,0,0.05)" : "0 1px 3px rgba(0,0,0,0.02)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <div
                style={{
                  width: mini ? 12 : 40,
                  height: mini ? 2 : 4,
                  backgroundColor: theme.primaryColor,
                  borderRadius: 4,
                  marginBottom: mini ? 4 : 16,
                }}
              />
              <div
                style={{
                  fontWeight: 800,
                  fontSize: mini ? 8 : 16,
                  color: theme.textColor,
                  marginBottom: mini ? 3 : 10,
                  fontFamily: theme.fontFamily,
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: mini ? 6 : 13,
                  color: theme.textColor,
                  opacity: 0.7,
                  lineHeight: 1.6,
                  fontFamily: theme.fontFamily,
                }}
              >
                {card.description}
              </div>
            </div>
          ))}
        </div>
      );

    case "statistic":
      return (
        <div style={{ textAlign: "center", padding: mini ? 6 : 24, backgroundColor: `${theme.primaryColor}08`, borderRadius: theme.borderRadius, border: `1px solid ${theme.primaryColor}15` }}>
          <div
            style={{
              fontSize: mini ? 16 : 56,
              fontWeight: 900,
              color: theme.primaryColor,
              fontFamily: theme.fontFamily,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {el.value}
          </div>
          <div
            style={{
              fontSize: mini ? 7 : 14,
              color: theme.textColor,
              opacity: 0.75,
              marginTop: mini ? 3 : 12,
              fontFamily: theme.fontFamily,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {el.label}
          </div>
        </div>
      );

    case "quote":
      return (
        <div style={{ position: "relative", padding: mini ? "10px 20px" : "40px 60px", backgroundColor: `${theme.primaryColor}05`, borderRadius: theme.borderRadius }}>
          <div style={{ position: "absolute", top: mini ? 4 : 20, left: mini ? 6 : 24, fontSize: mini ? 24 : 80, color: theme.primaryColor, opacity: 0.2, fontFamily: "serif", lineHeight: 1 }}>
            "
          </div>
          <p
            style={{
              fontSize: mini ? 9 : 24,
              fontStyle: "italic",
              color: theme.textColor,
              fontFamily: theme.fontFamily,
              fontWeight: 500,
              lineHeight: 1.6,
              margin: 0,
              position: "relative",
              zIndex: 2,
            }}
          >
            {el.content}
          </p>
        </div>
      );

    case "table":
      return (
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            {el.headers && (
              <thead>
                <tr>
                  {el.headers.map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: mini ? "2px 4px" : "8px 12px",
                        backgroundColor: theme.primaryColor,
                        color: "#fff",
                        fontSize: mini ? 6 : 12,
                        fontFamily: theme.fontFamily,
                        textAlign: "left",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(el.rows || []).map((row, ri) => (
                <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? "transparent" : `${theme.primaryColor}09` }}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: mini ? "2px 4px" : "8px 12px",
                        fontSize: mini ? 6 : 12,
                        color: theme.textColor,
                        fontFamily: theme.fontFamily,
                        borderBottom: `1px solid ${theme.primaryColor}20`,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "button":
      return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: mini ? 4 : 16 }}>
          <div
            style={{
              display: "inline-block",
              padding: mini ? "4px 10px" : "14px 32px",
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: theme.borderRadius,
              fontWeight: 600,
              fontSize: mini ? 7 : 14,
              fontFamily: theme.fontFamily,
            }}
          >
            {el.content}
          </div>
        </div>
      );

    default:
      return null;
  }
}

function renderLayout(
  slide: Slide,
  theme: PresentationTheme,
  mini: boolean,
  onElementClick?: (id: string) => void
) {
  const els = slide.elements || [];
  const heading = els.find((e) => e.type === "heading");
  const subheading = els.find((e) => e.type === "subheading");
  const paragraph = els.find((e) => e.type === "paragraph");
  const bullets = els.find((e) => e.type === "bullet_list");
  const image = els.find((e) => e.type === "image");
  const cards = els.find((e) => e.type === "card");
  const stats = els.filter((e) => e.type === "statistic");
  const quote = els.find((e) => e.type === "quote");
  const table = els.find((e) => e.type === "table");
  const button = els.find((e) => e.type === "button");

  const pad = mini ? 14 : 52;
  const gap = mini ? 5 : 18;

  const wrapStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor: theme.backgroundColor,
    padding: pad,
    display: "flex",
    flexDirection: "column",
    gap,
    fontFamily: theme.fontFamily,
    boxSizing: "border-box",
    overflow: "hidden",
  };

  const renderEl = (el: SlideElement, themeOverride?: Partial<PresentationTheme>) => (
    <ElementRenderer
      key={el.id}
      el={el}
      theme={themeOverride ? { ...theme, ...themeOverride } : theme}
      mini={mini}
      onElementClick={onElementClick}
    />
  );

  switch (slide.layout) {
    case "cover":
      return (
        <div style={{ ...wrapStyle, padding: 0, flexDirection: "row", alignItems: "stretch", backgroundColor: theme.primaryColor }}>
          <div style={{ flex: 1, padding: pad * 1.5, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
            {/* Decorative Corner */}
            <div style={{ position: "absolute", top: pad, left: pad, width: mini ? 20 : 60, height: mini ? 20 : 60, borderTop: `${mini ? 2 : 6}px solid ${theme.secondaryColor}`, borderLeft: `${mini ? 2 : 6}px solid ${theme.secondaryColor}` }} />
            
            <div style={{ marginBottom: gap * 2 }}>
               <div style={{ width: mini ? 24 : 80, height: mini ? 3 : 8, backgroundColor: theme.secondaryColor, borderRadius: 10, marginBottom: gap * 1.5 }} />
               {heading && renderEl(heading, { textColor: "#FFFFFF", headingFontSize: theme.headingFontSize * 1.6 })}
            </div>
            
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: mini ? 2 : 8 }}>
               {subheading && renderEl(subheading, { secondaryColor: "rgba(255,255,255,0.9)", headingFontSize: theme.headingFontSize * 0.7 })}
               {paragraph && renderEl(paragraph, { textColor: "rgba(255,255,255,0.7)" })}
            </div>
          </div>
          {/* Abstract Pattern Right Side */}
          <div style={{ flex: 0.85, backgroundColor: theme.secondaryColor, position: "relative", overflow: "hidden" }}>
             <div style={{ position: "absolute", width: "150%", height: "150%", top: "-25%", left: "-25%", background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)`, transform: "rotate(45deg)" }} />
             <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "80%", height: "80%", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
             <div style={{ position: "absolute", top: "15%", right: "15%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
             <div style={{ position: "absolute", bottom: "30%", left: "-10%", width: "30%", height: "30%", borderRadius: "50%", background: "rgba(0,0,0,0.04)" }} />
          </div>
        </div>
      );

    case "section_divider":
      return (
        <div
          style={{
            ...wrapStyle,
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: `${theme.primaryColor}05`,
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: mini ? 3 : 8, background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor})` }} />
          <div
            style={{
              width: mini ? 30 : 100,
              height: mini ? 3 : 8,
              backgroundColor: theme.secondaryColor,
              borderRadius: 4,
              marginBottom: gap,
            }}
          />
          {heading && renderEl(heading, { headingFontSize: theme.headingFontSize * 1.3 })}
          {paragraph && renderEl(paragraph)}
        </div>
      );

    case "text_image":
      return (
        <div style={{ ...wrapStyle, flexDirection: "row", alignItems: "stretch", padding: 0 }}>
          <div
            style={{
              flex: 1,
              padding: pad * 1.2,
              display: "flex",
              flexDirection: "column",
              gap: gap * 1.2,
              justifyContent: "center",
            }}
          >
            {heading && renderEl(heading)}
            {paragraph && renderEl(paragraph)}
            {bullets && renderEl(bullets)}
          </div>
          <div
            style={{
              width: "45%",
              flexShrink: 0,
              backgroundColor: "#F8FAFC",
              overflow: "hidden",
            }}
          >
            {image && renderEl(image)}
          </div>
        </div>
      );

    case "image_text":
      return (
        <div style={{ ...wrapStyle, flexDirection: "row", alignItems: "stretch", padding: 0 }}>
          <div
            style={{ width: "45%", flexShrink: 0, backgroundColor: "#F8FAFC", overflow: "hidden" }}
          >
            {image && renderEl(image)}
          </div>
          <div
            style={{
              flex: 1,
              padding: pad * 1.2,
              display: "flex",
              flexDirection: "column",
              gap: gap * 1.2,
              justifyContent: "center",
            }}
          >
            {heading && renderEl(heading)}
            {paragraph && renderEl(paragraph)}
            {bullets && renderEl(bullets)}
          </div>
        </div>
      );

    case "statistics":
      return (
        <div style={wrapStyle}>
          {heading && renderEl(heading)}
          <div style={{ display: "flex", gap: gap * 1.5, flex: 1, alignItems: "center" }}>
            {stats.length > 0
              ? stats.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      flex: 1,
                    }}
                  >
                    <ElementRenderer el={s} theme={theme} mini={mini} onElementClick={onElementClick} />
                  </div>
                ))
              : els
                  .filter((e) => e.type !== "heading")
                  .map((e) => (
                    <div key={e.id} style={{ flex: 1 }}>
                      <ElementRenderer el={e} theme={theme} mini={mini} onElementClick={onElementClick} />
                    </div>
                  ))}
          </div>
        </div>
      );

    case "quote":
      return (
        <div style={{ ...wrapStyle, justifyContent: "center", alignItems: "flex-start" }}>
          {quote && renderEl(quote)}
          {paragraph && renderEl(paragraph, { textColor: theme.secondaryColor })}
        </div>
      );

    case "comparison":
    case "table":
      return (
        <div style={wrapStyle}>
          {heading && renderEl(heading)}
          {table && renderEl(table)}
        </div>
      );

    case "cta":
      return (
        <div style={{ ...wrapStyle, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          {heading && renderEl(heading)}
          {paragraph && renderEl(paragraph)}
          {button && renderEl(button)}
        </div>
      );

    default:
      // Handles: title_content, three_cards, four_cards, pricing, key_benefits, timeline, process, case_study, full_image
      return (
        <div style={wrapStyle}>
          {heading && renderEl(heading)}
          {subheading && renderEl(subheading)}
          {paragraph && renderEl(paragraph)}
          {bullets && renderEl(bullets)}
          {cards && renderEl(cards)}
          {stats.map((s) => (
            <ElementRenderer key={s.id} el={s} theme={theme} mini={mini} onElementClick={onElementClick} />
          ))}
          {table && renderEl(table)}
          {image && renderEl(image)}
          {button && renderEl(button)}
        </div>
      );
  }
}

export default function SlideRenderer({
  slide,
  theme,
  scale = 1,
  isSelected,
  isThumbnail,
  onElementClick,
}: SlideRendererProps) {
  const mini = !!isThumbnail;
  // 16:9 base dimensions
  const W = 960;
  const H = 540;

  return (
    <div
      style={{
        width: W * scale,
        height: H * scale,
        overflow: "hidden",
        borderRadius: mini ? 4 : 10,
        boxShadow: isSelected
          ? "0 0 0 2px #7C3AED, 0 4px 20px rgba(124,58,237,0.15)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {renderLayout(slide, theme, mini, onElementClick)}
      </div>
    </div>
  );
}

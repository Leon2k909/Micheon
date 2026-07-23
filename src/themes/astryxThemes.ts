import { defineTheme } from "@astryxdesign/core/theme";
import { butterTheme } from "@astryxdesign/theme-butter";
import { neutralTheme } from "@astryxdesign/theme-neutral";

/**
 * Meta's Butter light palette is the source of truth for this preset. Its
 * stock dark palette is intentionally replaced: the brown surfaces did not
 * belong in Micheon, so dark mode uses the prototype's graphite foundation.
 */
export const micheonButterTheme = defineTheme({
  name: "micheon-butter",
  extends: butterTheme,
  tokens: {
    "--color-accent": ["#225BFF", "#FDEE8C"],
    "--color-accent-muted": ["#225BFF33", "#FDEE8C2E"],
    "--color-neutral": ["#1D1C110F", "#FFFFFF14"],

    "--color-background-surface": ["#FFFFFF", "#1B1D27"],
    "--color-background-body": ["#FDFBE4", "#11121A"],
    "--color-background-card": ["#FFFFFF", "#20222D"],
    "--color-background-popover": ["#FFFFFF", "#20222D"],
    "--color-background-muted": ["#F3F2E2", "#252735"],
    "--color-background-inverted": ["#1D1C11", "#F7F7FB"],

    "--color-overlay": ["#1D1C1180", "#11121ACC"],
    "--color-overlay-hover": ["#1D1C110D", "#FFFFFF0D"],
    "--color-overlay-pressed": ["#1D1C111A", "#FFFFFF1A"],

    "--color-text-primary": ["#1D1C11", "#F7F7FB"],
    "--color-text-secondary": ["#605F52", "#D2D4DF"],
    "--color-text-disabled": ["#ADAC9E", "#737889"],
    "--color-text-accent": ["#225BFF", "#FDEE8C"],
    "--color-on-accent": ["#FFFFFF", "#1D1C11"],

    "--color-icon-accent": ["#225BFF", "#FDEE8C"],
    "--color-icon-primary": ["#1D1C11", "#F7F7FB"],
    "--color-icon-secondary": ["#605F52", "#A7ABBA"],
    "--color-icon-disabled": ["#ADAC9E", "#636777"],

    "--color-border": ["#E5E3D4", "#343746"],
    "--color-border-emphasized": ["#C7C4B2", "#4A4E61"],
    "--color-skeleton": ["#E5E3D4", "#343746"],
    "--color-shadow": ["#1D1C111A", "#00000066"],

    "--color-success": ["#004700", "#7FF0BA"],
    "--color-success-muted": ["#00470020", "#173F32"],
    "--color-warning": ["#543700", "#FFD95A"],
    "--color-warning-muted": ["#54370020", "#473D16"],

    "--shadow-low":
      "0 1px 2px light-dark(#1D1C110A, #0000003D), 0 8px 24px light-dark(#1D1C110F, #00000038)",
    "--shadow-med":
      "0 2px 5px light-dark(#1D1C1110, #0000004D), 0 18px 44px light-dark(#1D1C1117, #00000059)",
    "--shadow-high":
      "0 4px 8px light-dark(#1D1C1114, #0000005C), 0 28px 72px light-dark(#1D1C1124, #00000073)",
  },
  components: {
    card: {
      "variant:mission": {
        backgroundColor: "light-dark(#225BFF, #2D4FD7)",
        borderColor: "light-dark(#1740C8, #6E8AFF)",
        color: "#FFFFFF",
        boxShadow:
          "0 18px 46px light-dark(#225BFF38, #00000070), inset 0 1px 0 #FFFFFF2B",
        "--color-text-primary": "#FFFFFF",
        "--color-text-secondary": "#E4EAFF",
        "--color-text-accent": "#FFFFFF",
        "--color-icon-primary": "#FFFFFF",
        "--color-icon-secondary": "#DCE4FF",
        "--color-icon-accent": "#FFFFFF",
        "--color-accent": "#FFFFFF",
        "--color-on-accent": "#225BFF",
        "--color-accent-muted": "#FFFFFF24",
        "--color-background-muted": "#FFFFFF1A",
        "--color-background-purple": "#FFFFFF24",
        "--color-border-purple": "#FFFFFF3D",
        "--color-text-purple": "#FFFFFF",
        "--color-icon-purple": "#FFFFFF",
        "--color-border": "#FFFFFF2E",
        "--color-border-emphasized": "#FFFFFF4A",
      },
    },
    "progressbar-track": {
      base: {
        backgroundColor: "light-dark(#E5E3D4, #343746)",
      },
    },
  },
});

/**
 * Exact Micheon Astryx prototype theme. This intentionally extends Meta's
 * Neutral source theme instead of recolouring Butter.
 */
export const butterPurpleTheme = defineTheme({
  name: "butter-purple",
  extends: neutralTheme,
  typography: {
    scale: { base: 14, ratio: 1.2 },
    body: {
      family: "ui-rounded",
      fallbacks:
        '"SF Pro Rounded", Aptos, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    },
    heading: {
      family: "ui-rounded",
      fallbacks:
        '"SF Pro Rounded", Aptos, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      weights: { 1: 800, 2: 800, 3: 750, 4: 750 },
    },
    code: {
      family: "ui-monospace",
      fallbacks:
        '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  motion: { fast: 130, medium: 280, slow: 650, ratio: 0.75 },
  tokens: {
    "--color-background-surface": ["#FFFFFF", "#1B1D27"],
    "--color-background-body": ["#DEDEE9", "#11121A"],
    "--color-background-card": ["#FFFFFF", "#1B1D27"],
    "--color-background-popover": ["#FFFFFF", "#20222D"],
    "--color-background-muted": ["#F5F5F9", "#252735"],

    "--color-accent": ["#7834F7", "#A177FF"],
    "--color-accent-muted": ["#EFE7FF", "#33245F"],
    "--color-neutral": ["#11121A0D", "#FFFFFF14"],

    "--color-text-primary": ["#070707", "#F7F7FB"],
    "--color-text-secondary": ["#5D606B", "#D2D4DF"],
    "--color-text-disabled": ["#9A9EAA", "#737889"],
    "--color-text-accent": ["#6425DF", "#B89AFF"],
    "--color-on-accent": "#FFFFFF",
    "--color-on-dark": "#FFFFFF",
    "--color-on-light": "#11121A",

    "--color-icon-primary": ["#11121A", "#F7F7FB"],
    "--color-icon-secondary": ["#717582", "#A7ABBA"],
    "--color-icon-disabled": ["#A8ABB5", "#636777"],
    "--color-icon-accent": ["#7834F7", "#A177FF"],

    "--color-border": ["#E4E4ED", "#343746"],
    "--color-border-emphasized": ["#CFD0DC", "#4A4E61"],
    "--color-shadow": ["#191B2614", "#00000066"],

    "--color-background-purple": ["#EEE7FF", "#30224E"],
    "--color-border-purple": ["#D9CBFF", "#7658B8"],
    "--color-icon-purple": ["#6425DF", "#B89AFF"],
    "--color-text-purple": ["#5920CA", "#D7C6FF"],

    "--color-background-blue": ["#E5F0FF", "#203552"],
    "--color-border-blue": ["#C8DEFB", "#4774A8"],
    "--color-icon-blue": ["#236AB5", "#8FC6FF"],
    "--color-text-blue": ["#1D5B9D", "#ADD5FF"],

    "--color-background-green": ["#DCF6FF", "#183D49"],
    "--color-border-green": ["#A8DDEA", "#367081"],
    "--color-icon-green": ["#087494", "#82DDF2"],
    "--color-text-green": ["#075E78", "#A5E9F7"],

    "--color-background-cyan": ["#DCF6FF", "#183D49"],
    "--color-border-cyan": ["#A8DDEA", "#367081"],
    "--color-icon-cyan": ["#087494", "#82DDF2"],
    "--color-text-cyan": ["#075E78", "#A5E9F7"],

    "--color-background-yellow": ["#FFF6CF", "#473D16"],
    "--color-border-yellow": ["#F1DC7B", "#8C7624"],
    "--color-icon-yellow": ["#8D6C00", "#FFD95A"],
    "--color-text-yellow": ["#735800", "#FFE98D"],

    "--color-background-orange": ["#FFEADB", "#4B2B19"],
    "--color-border-orange": ["#FFCBA8", "#8A5634"],
    "--color-icon-orange": ["#C75B0C", "#FFAD72"],
    "--color-text-orange": ["#A34808", "#FFC89F"],

    "--color-success": ["#087494", "#82DDF2"],
    "--color-success-muted": ["#DCF6FF", "#183D49"],
    "--color-warning": ["#8D6C00", "#FFD95A"],
    "--color-warning-muted": ["#FFF6CF", "#473D16"],

    "--radius-none": "0",
    "--radius-inner": "0.375rem",
    "--radius-element": "0.5rem",
    "--radius-container": "0.5rem",
    "--radius-page": "0.75rem",
    "--radius-full": "9999px",

    "--shadow-low":
      "0 1px 2px light-dark(#191B260A, #0000003D), 0 8px 24px light-dark(#191B260F, #00000038)",
    "--shadow-med":
      "0 2px 5px light-dark(#191B2610, #0000004D), 0 18px 44px light-dark(#191B2617, #00000059)",
    "--shadow-high":
      "0 4px 8px light-dark(#191B2614, #0000005C), 0 28px 72px light-dark(#191B2624, #00000073)",
  },
  components: {
    card: {
      base: {
        borderRadius: "var(--radius-container)",
        borderColor: "var(--color-border)",
      },
      "variant:mission": {
        backgroundColor: "light-dark(#7834F7, #6F35D8)",
        borderColor: "light-dark(#6B2EE6, #9F79F1)",
        color: "#FFFFFF",
        boxShadow:
          "0 18px 46px light-dark(#7834F738, #00000070), inset 0 1px 0 #FFFFFF2B",
        "--color-text-primary": "#FFFFFF",
        "--color-text-secondary": "#EADFFF",
        "--color-text-accent": "#FFFFFF",
        "--color-icon-primary": "#FFFFFF",
        "--color-icon-secondary": "#E4D6FF",
        "--color-icon-accent": "#FFFFFF",
        "--color-accent": "#FFFFFF",
        "--color-on-accent": "#6425DF",
        "--color-accent-muted": "#FFFFFF24",
        "--color-background-muted": "#FFFFFF1A",
        "--color-border": "#FFFFFF2E",
        "--color-border-emphasized": "#FFFFFF4A",
      },
      "variant:practice": {
        backgroundColor: "var(--color-background-card)",
        borderColor: "var(--color-accent)",
        boxShadow:
          "0 0 0 3px light-dark(#7834F716, #A177FF1F), var(--shadow-med)",
      },
    },
    section: {
      base: {
        borderRadius: "var(--radius-container)",
      },
    },
    button: {
      base: {
        borderRadius: "var(--radius-element)",
        fontWeight: "750",
        "--button-press-scale": "scale(0.975)",
      },
      "variant:primary": {
        backgroundColor: "var(--color-accent)",
        color: "var(--color-on-accent)",
        boxShadow: "0 3px 0 light-dark(#4E16B8, #4B218E)",
      },
      "variant:secondary": {
        borderColor: "var(--color-border-emphasized)",
      },
    },
    badge: {
      "variant:purple": {
        backgroundColor: "var(--color-accent-muted)",
        color: "var(--color-text-accent)",
      },
    },
    progressbar: {
      base: {
        "--color-background-muted": "var(--color-border-emphasized)",
      },
      "variant:accent": {
        "--color-accent": "light-dark(#7834F7, #A177FF)",
      },
      "variant:success": {
        "--color-success": "#46D59A",
      },
      "variant:warning": {
        "--color-warning": "#FFD233",
      },
    },
    topnav: {
      base: {
        backgroundColor: "var(--color-background-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-low)",
      },
    },
    sidenav: {
      base: {
        backgroundColor: "var(--color-background-surface)",
        borderColor: "var(--color-border)",
      },
    },
  },
});

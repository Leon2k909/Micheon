import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export const micheonTheme = defineTheme({
  name: 'micheon',
  extends: neutralTheme,
  typography: {
    scale: {base: 14, ratio: 1.2},
    body: {
      family: 'ui-rounded',
      fallbacks:
        '"SF Pro Rounded", Aptos, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    },
    heading: {
      family: 'ui-rounded',
      fallbacks:
        '"SF Pro Rounded", Aptos, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      weights: {1: 800, 2: 800, 3: 750, 4: 750},
    },
    code: {
      family: 'ui-monospace',
      fallbacks:
        '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  motion: {fast: 130, medium: 280, slow: 650, ratio: 0.75},
  tokens: {
    '--color-background-surface': ['#ffffff', '#1b1d27'],
    '--color-background-body': ['#dedee9', '#11121a'],
    '--color-background-card': ['#ffffff', '#1b1d27'],
    '--color-background-popover': ['#ffffff', '#20222d'],
    '--color-background-muted': ['#f5f5f9', '#252735'],

    '--color-accent': ['#7834f7', '#a177ff'],
    '--color-accent-muted': ['#efe7ff', '#33245f'],
    '--color-neutral': ['#11121a0D', '#FFFFFF14'],

    '--color-text-primary': ['#070707', '#f7f7fb'],
    '--color-text-secondary': ['#5d606b', '#d2d4df'],
    '--color-text-disabled': ['#9a9eaa', '#737889'],
    '--color-text-accent': ['#6425df', '#b89aff'],
    '--color-on-accent': '#ffffff',
    '--color-on-dark': '#ffffff',
    '--color-on-light': '#11121a',

    '--color-icon-primary': ['#11121a', '#f7f7fb'],
    '--color-icon-secondary': ['#717582', '#a7abba'],
    '--color-icon-disabled': ['#a8abb5', '#636777'],
    '--color-icon-accent': ['#7834f7', '#a177ff'],

    '--color-border': ['#e4e4ed', '#343746'],
    '--color-border-emphasized': ['#cfd0dc', '#4a4e61'],
    '--color-shadow': ['#191b2614', '#00000066'],

    '--color-background-purple': ['#eee7ff', '#30224e'],
    '--color-border-purple': ['#d9cbff', '#7658b8'],
    '--color-icon-purple': ['#6425df', '#b89aff'],
    '--color-text-purple': ['#5920ca', '#d7c6ff'],

    '--color-background-blue': ['#e5f0ff', '#203552'],
    '--color-border-blue': ['#c8defb', '#4774a8'],
    '--color-icon-blue': ['#236ab5', '#8fc6ff'],
    '--color-text-blue': ['#1d5b9d', '#add5ff'],

    '--color-background-green': ['#dcfff1', '#173f32'],
    '--color-border-green': ['#b9efd8', '#34745e'],
    '--color-icon-green': ['#139a62', '#7ff0ba'],
    '--color-text-green': ['#0e8050', '#9bf5ca'],

    '--color-background-yellow': ['#fff6cf', '#473d16'],
    '--color-border-yellow': ['#f1dc7b', '#8c7624'],
    '--color-icon-yellow': ['#8d6c00', '#ffd95a'],
    '--color-text-yellow': ['#735800', '#ffe98d'],

    '--color-background-orange': ['#ffeadb', '#4b2b19'],
    '--color-border-orange': ['#ffcba8', '#8a5634'],
    '--color-icon-orange': ['#c75b0c', '#ffad72'],
    '--color-text-orange': ['#a34808', '#ffc89f'],

    '--color-success': ['#139a62', '#7ff0ba'],
    '--color-success-muted': ['#dcfff1', '#173f32'],
    '--color-warning': ['#8d6c00', '#ffd95a'],
    '--color-warning-muted': ['#fff6cf', '#473d16'],

    '--radius-none': '0',
    '--radius-inner': '0.375rem',
    '--radius-element': '0.5rem',
    '--radius-container': '0.5rem',
    '--radius-page': '0.75rem',
    '--radius-full': '9999px',

    '--shadow-low':
      '0 1px 2px light-dark(#191b260A, #0000003D), 0 8px 24px light-dark(#191b260F, #00000038)',
    '--shadow-med':
      '0 2px 5px light-dark(#191b2610, #0000004D), 0 18px 44px light-dark(#191b2617, #00000059)',
    '--shadow-high':
      '0 4px 8px light-dark(#191b2614, #0000005C), 0 28px 72px light-dark(#191b2624, #00000073)',
  },
  components: {
    card: {
      base: {
        borderRadius: 'var(--radius-container)',
        borderColor: 'var(--color-border)',
      },
      'variant:mission': {
        backgroundColor: 'light-dark(#7834f7, #6f35d8)',
        borderColor: 'light-dark(#6b2ee6, #9f79f1)',
        color: '#ffffff',
        boxShadow:
          '0 18px 46px light-dark(#7834f738, #00000070), inset 0 1px 0 #FFFFFF2B',
        '--color-text-primary': '#ffffff',
        '--color-text-secondary': '#eadfff',
        '--color-text-accent': '#ffffff',
        '--color-icon-primary': '#ffffff',
        '--color-icon-secondary': '#e4d6ff',
        '--color-icon-accent': '#ffffff',
        '--color-accent': '#ffffff',
        '--color-on-accent': '#6425df',
        '--color-accent-muted': '#FFFFFF24',
        '--color-background-muted': '#FFFFFF1A',
        '--color-border': '#FFFFFF2E',
        '--color-border-emphasized': '#FFFFFF4A',
      },
      'variant:practice': {
        backgroundColor: 'var(--color-background-card)',
        borderColor: 'var(--color-accent)',
        boxShadow:
          '0 0 0 3px light-dark(#7834f716, #a177ff1F), var(--shadow-med)',
      },
    },
    section: {
      base: {
        borderRadius: 'var(--radius-container)',
      },
    },
    button: {
      base: {
        borderRadius: 'var(--radius-element)',
        fontWeight: '750',
        '--button-press-scale': 'scale(0.975)',
      },
      'variant:primary': {
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-on-accent)',
        boxShadow: '0 3px 0 light-dark(#4e16b8, #4b218e)',
      },
      'variant:secondary': {
        borderColor: 'var(--color-border-emphasized)',
      },
    },
    badge: {
      'variant:purple': {
        backgroundColor: 'var(--color-accent-muted)',
        color: 'var(--color-text-accent)',
      },
    },
    progressbar: {
      base: {
        '--color-background-muted': 'var(--color-border-emphasized)',
      },
      'variant:accent': {
        '--color-accent': 'light-dark(#7834f7, #a177ff)',
      },
      'variant:success': {
        '--color-success': '#46d59a',
      },
      'variant:warning': {
        '--color-warning': '#ffd233',
      },
    },
    topnav: {
      base: {
        backgroundColor: 'var(--color-background-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-low)',
      },
    },
    sidenav: {
      base: {
        backgroundColor: 'var(--color-background-surface)',
        borderColor: 'var(--color-border)',
      },
    },
  },
});

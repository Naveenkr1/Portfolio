import { css } from 'styled-components';

const variables = css`
  :root {
    --dark-navy: #020c1b;
    --navy: #0a192f;
    --light-navy: #112240;
    --lightest-navy: #233554;
    --navy-shadow: rgba(2, 12, 27, 0.7);
    --dark-slate: #495670;
    --slate: #8892b0;
    --light-slate: #a8b2d1;
    --lightest-slate: #ccd6f6;
    --white: #e6f1ff;
    --green: #64ffda;
    --green-tint: rgba(100, 255, 218, 0.1);
    --pink: #f57dff;
    --blue: #57cbff;

    --card-bg: rgba(17, 34, 64, 0.7);
    --card-border: rgba(100, 255, 218, 0.1);
    --sidebar-border: rgba(255, 255, 255, 0.1);
    --tech-bg: rgba(255, 255, 255, 0.05);
    --tech-border: rgba(255, 255, 255, 0.1);
    --tech-img-filter: brightness(0) invert(1);

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  html.light-theme {
    --dark-navy: #F5EFE0;
    --navy: #FFFBF0;
    --light-navy: #ffffff;
    --lightest-navy: #EFE7D2;
    --navy-shadow: rgba(43, 37, 20, 0.05);
    --dark-slate: #64748b;
    --slate: #334155;
    --light-slate: #1e293b;
    --lightest-slate: #0f172a;
    --white: #0f172a;
    --green: #0d9488;
    --green-tint: rgba(13, 148, 136, 0.1);
    --pink: #c026d3;
    --blue: #2563eb;

    --card-bg: rgba(255, 255, 255, 0.85);
    --card-border: rgba(13, 148, 136, 0.15);
    --sidebar-border: rgba(15, 23, 42, 0.15);
    --tech-bg: rgba(15, 23, 42, 0.05);
    --tech-border: rgba(15, 23, 42, 0.1);
    --tech-img-filter: none;
  }
`;

export default variables;

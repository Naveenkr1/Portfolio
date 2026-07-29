const React = require('react');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    React.createElement('script', {
      key: 'theme-toggle',
      dangerouslySetInnerHTML: {
        __html: `
          (function() {
            var pathname = window.location.pathname;
            if (pathname && pathname.indexOf('case-study') !== -1) {
              var theme = localStorage.getItem('theme');
              if (theme === 'light') {
                document.documentElement.classList.add('light-theme');
              } else if (theme === 'dark') {
                document.documentElement.classList.remove('light-theme');
              } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.documentElement.classList.add('light-theme');
              }
            } else {
              document.documentElement.classList.remove('light-theme');
            }
          })();
        `,
      },
    }),
  ]);
};
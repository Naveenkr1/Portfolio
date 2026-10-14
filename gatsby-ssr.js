const React = require('react');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    React.createElement('script', {
      key: 'theme-toggle',
      dangerouslySetInnerHTML: {
        __html: `
          (function() {
            document.documentElement.classList.remove('light-theme');
            try { localStorage.removeItem('theme'); } catch(e) {}
          })();
        `,
      },
    }),
  ]);
};
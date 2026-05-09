const fs = require('fs');
let html = fs.readFileSync('Portfolio v3.html', 'utf8');

// Remove React and Babel unpkg scripts
html = html.replace(/<script src="https:\/\/unpkg\.com\/react@.*?<\/script>\n/g, '');
html = html.replace(/<script src="https:\/\/unpkg\.com\/react-dom@.*?<\/script>\n/g, '');
html = html.replace(/<script src="https:\/\/unpkg\.com\/@babel\/standalone@.*?<\/script>\n/g, '');

// Replace old JSX scripts with Vite main entry
html = html.replace(/<script type="text\/babel" src="pv3-shared\.jsx"><\/script>\n/g, '');
html = html.replace(/<script type="text\/babel" src="pv3-sections\.jsx"><\/script>\n/g, '');
html = html.replace(/<script type="text\/babel" src="pv3-app\.jsx"><\/script>\n/g, '');
html = html.replace(/<\/head>/, '  <script type="module" src="/src/main.jsx"></script>\n</head>');

fs.writeFileSync('index.html', html);
console.log('index.html generated.');

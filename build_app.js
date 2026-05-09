const fs = require('fs');
const shared = fs.readFileSync('pv3-shared.jsx', 'utf8');
const sections = fs.readFileSync('pv3-sections.jsx', 'utf8');
let app = fs.readFileSync('pv3-app.jsx', 'utf8');
app = app.replace("ReactDOM.createRoot(document.getElementById('root')).render(<App />);", "export default App;");
const out = `import React from 'react';\n${shared}\n${sections}\n${app}`;
fs.mkdirSync('src', { recursive: true });
fs.writeFileSync('src/App.jsx', out);
console.log('src/App.jsx generated.');

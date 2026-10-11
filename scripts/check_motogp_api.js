import fs from 'fs';

const html = fs.readFileSync('scripts/motogp_page.html', 'utf8');

// Find any api or graphql urls
const apis = html.match(/https:\/\/[a-zA-Z0-9.-]+motogp\.com[^"'\s<>]*/g) || [];
console.log('MotoGP URLs:', [...new Set(apis)].slice(0, 20));

// Check if there is api.motogp.com
const matches = html.match(/"([^"]*api[^"]*)"/g) || [];
console.log('API strings:', matches.slice(0, 20));

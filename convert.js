const fs = require('fs');

try {
    let html = fs.readFileSync('C:/Users/user/perposal agent real/ui/public/index.html', 'utf8');
    
    // Basic conversion
    html = html.replace(/class=/g, 'className=');
    html = html.replace(/for=/g, 'htmlFor=');
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    html = html.replace(/<img([^>]*[^/])>/g, '<img$1/>');
    html = html.replace(/<input([^>]*[^/])>/g, '<input$1/>');
    html = html.replace(/<br([^>]*[^/])>/g, '<br$1/>');
    html = html.replace(/<hr([^>]*[^/])>/g, '<hr$1/>');
    html = html.replace(/style="([^"]*)"/g, ''); // strip inline styles for now

    // extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    let body = bodyMatch ? bodyMatch[1] : html;

    // remove script tags
    body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    const component = `
export default function Dashboard() {
  return (
    <>
      ${body}
    </>
  );
}
`;
    fs.writeFileSync('src/app/page.tsx', component);
    console.log("Converted successfully!");
} catch (e) {
    console.error(e);
}

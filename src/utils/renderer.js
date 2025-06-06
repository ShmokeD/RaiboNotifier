import fs from 'fs';
import path from 'path';
import  mjml2html  from 'mjml'


async function renderTemplate(templateName, variables) {
  const templatePath = path.join(process.cwd(), 'src/templates', `${templateName}.mjml`);
  let mjmlTemplate = fs.readFileSync(templatePath, 'utf8');


  for (const key in variables) {
    mjmlTemplate = mjmlTemplate.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
  }


  const { html, errors } = await mjml2html(mjmlTemplate);

  if (errors.length > 0 ) {
    console.error('MJML errors:', errors);
    throw new Error('Failed to compile MJML');
  }

  return html;
}

export { renderTemplate };

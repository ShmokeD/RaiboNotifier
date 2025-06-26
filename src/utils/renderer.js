import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import  mjml2html  from 'mjml'


async function renderTemplate(templateName, variables) {
  const templatePath = path.join(process.cwd(), 'src/templates', `${templateName}.mjml`);
  let mjmlTemplate = fs.readFileSync(templatePath, 'utf8');


  const compiledTemplate = Handlebars.compile(mjmlTemplate);
  const variablesObj = variables.toObject({ flattenMaps: true });

  //Always show first name if used
  variablesObj['name'] = variablesObj['name']?.split(' ')[0] || '';
  const compiledMjml = compiledTemplate(variablesObj);



  const { html, errors } = await mjml2html(compiledMjml);

  if (errors.length > 0 ) {
    console.error('MJML errors:', errors);
    throw new Error('Failed to compile MJML');
  }

  return html;
}

export { renderTemplate };

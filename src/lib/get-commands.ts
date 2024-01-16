import fetch from 'node-fetch';

const BASE_TEMPLATE_URL = 'https://raw.githubusercontent.com/itaibo/create-something/main/templates';

type TemplateName = 'basic';

export const getCommands = async (templateName: TemplateName): Promise<string[]> => {
  const url = `${BASE_TEMPLATE_URL}/${templateName}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);

    const commands = await response.json() as string[];
    return commands;
  } catch (e) {
    throw e;
  };
};

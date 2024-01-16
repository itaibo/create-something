import axios from 'axios';

const BASE_TEMPLATE_URL = 'https://raw.githubusercontent.com/itaibo/create-something/main/templates';

type TemplateName = 'basic';

export const getCommands = async (templateName: TemplateName): Promise<string[]> => {
  const url = `${BASE_TEMPLATE_URL}/${templateName}.json`;

  try {
    const response = await axios.get(url);
    const commands = await response.data as string[];

    return commands;
  } catch (e) {
    throw e;
  };
};

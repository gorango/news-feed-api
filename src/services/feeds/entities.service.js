import retext from 'retext';
import nlcstToString from 'nlcst-to-string';
import keywords from 'retext-keywords';

const re = retext().use(keywords)

export const extractEntities = (text) => {
  const entities = re.process(text, (error, file) => {
    if (error) {
      console.log(`[Extraction error]: '${ text }'`, error);;
    }
    return file;
  });

  const keywords = entities.data.keywords.map(keyword => {
    return nlcstToString(keyword.matches[0].node)
  });

  const keyphrases = entities.data.keyphrases.map(phrase => {
    return phrase.matches[0].nodes.map(nlcstToString).join('')
  });

  return {
    keywords,
    keyphrases
  };
}

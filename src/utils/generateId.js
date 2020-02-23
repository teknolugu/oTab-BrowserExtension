const shortid = require('shortid');

export default function(items) {
  const generateId = shortid.generate();
  const itemKeys = Object.keys(items);

  const findId = itemKeys.find(item => item.id === generateId);
  while (findId) {
    generateId;
  }
  return generateId;
}

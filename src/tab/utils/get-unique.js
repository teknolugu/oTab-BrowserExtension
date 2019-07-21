export default function getUnique(item1, item2, key = '') {
  let copyItem = [...item2];
  item1.filter(item => {
    let filteredItem = copyItem.findIndex(data => data[key] === item[key]);
    if (filteredItem !== -1) {
      copyItem.splice(filteredItem, 1);
    }
  });
  return copyItem;
}

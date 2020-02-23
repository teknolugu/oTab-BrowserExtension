export default function(data, id) {
  return data.findIndex(item => item.id === id);
}

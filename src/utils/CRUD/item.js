import Item from '../../store/models/item';

export async function updateItem(id, data) {
  Item.update({
    where: item => item.id === id,
    data,
  });
}

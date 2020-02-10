import Column from '../../store/models/column';
import store from '../../store';

const { activeBoard } = store.state;

export function getColumns(withData = '') {
  return store.getters.getColumnByBoardId();
}

export async function updateColumn(id, data) {
  store.dispatch('entities/update', {
    entity: 'columns',
    where: item => item.id === id,
    data: {
      ...data,
      title: 'aaa',
    },
  });
}

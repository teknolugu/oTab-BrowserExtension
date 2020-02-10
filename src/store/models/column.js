import { Model } from '@vuex-orm/core';
import Item from './item';
import Tag from './Tag';
import Board from './board';

export default class Column extends Model {
  static entity = 'columns';

  static fields() {
    return {
      id: this.uid(),
      title: this.string(''),
      tag_ids: this.attr([]),
      board: this.belongsTo(Board, 'board_id'),
      board_id: this.attr(null),
      items: this.hasMany(Item, 'column_id', 'id'),
      tags: this.hasManyBy(Tag),
    };
  }
}

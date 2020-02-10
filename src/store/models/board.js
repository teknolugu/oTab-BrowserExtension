import { Model } from '@vuex-orm/core';
import Column from './column';

export default class Board extends Model {
  static entity = 'boards';

  static fields() {
    return {
      id: this.uid(),
      title: this.string(''),
      columns: this.hasMany(Column, 'board_id', 'id'),
    };
  }
}

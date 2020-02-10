import { Model } from '@vuex-orm/core';

export default class Tag extends Model {
  static entity = 'tags';

  static fields() {
    return {
      title: this.string(),
      color: this.string(),
      list_id: this.attr([]),
    };
  }
}

import { Model } from '@vuex-orm/core';

export default class Item extends Model {
  static entity = 'Lists';

  static fields() {
    return {
      id: this.uid(),
      column_id: this.attr(null),
      title: this.string(),
      content: this.string(),
      type: this.string(),
      done: this.attr(false),
      favIconUrl: this.string(),
      url: this.string(),
    };
  }
}

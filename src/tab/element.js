import Vue from 'vue';
import 'element-ui/lib/theme-chalk/reset.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import {
  Dialog,
  Menu,
  MenuItem,
  Input,
  Checkbox,
  Select,
  Button,
  Popover,
  Tag,
  Image,
  Icon,
  Row,
  Col,
  Card,
  Collapse,
  CollapseItem,
  ColorPicker,
  Scrollbar,
  Main,
  Divider,
  Switch,
  Option,
  MessageBox,
  Message,
  RadioGroup,
  Tabs,
  TabPane,
  RadioButton,
  Form,
  FormItem,
} from 'element-ui';
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Dialog);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Option);
Vue.use(Scrollbar);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Tag);
Vue.use(Image);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(ColorPicker);
Vue.use(Main);
Vue.use(Divider);
Vue.use(RadioGroup);
Vue.use(RadioButton);

import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

locale.use(lang);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

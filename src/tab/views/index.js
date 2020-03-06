import Board from './Board.vue';
import Note from './Note.vue';
import Home from './home.vue';

export default [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'board',
    path: '/board',
    component: Board,
  },
  {
    name: 'note',
    path: '/note/:id',
    component: Note,
  },
  {
    path: '*',
    redirect: '/',
  },
];

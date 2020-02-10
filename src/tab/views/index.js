import Board from './Board.vue';
import Note from './Note.vue';
import Index from './index.vue';

export default [
  {
    name: 'index',
    path: '/',
    component: Index,
  },
  {
    name: 'board',
    path: '/board',
    component: Board,
  },
  {
    name: 'note',
    path: '/note',
    component: Note,
  },
  {
    path: '*',
    redirect: '/',
  },
];

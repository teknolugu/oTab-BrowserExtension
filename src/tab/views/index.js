import Home from './home.vue';
import Board from './Board.vue';
import Note from './Note.vue';

// Home nested routes
import BoardList from './Home/BoardList.vue';
import Profile from './Home/Profile.vue';
import Preferences from './Home/Preferences.vue';
import Backup from './Home/Backup.vue';

export default [
  {
    path: '/home',
    component: Home,
    children: [
      {
        name: 'home-board-list',
        path: '',
        component: BoardList,
      },
      {
        name: 'home-profile',
        path: 'profile',
        component: Profile,
      },
      {
        name: 'home-preferences',
        path: 'preferences',
        component: Preferences,
      },
      {
        name: 'home-backup',
        path: 'backup',
        component: Backup,
      },
    ],
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
    redirect: '/home',
  },
];

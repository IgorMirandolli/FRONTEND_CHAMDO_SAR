
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'stats', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/abrirchamado',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'abrirChamado', component: () => import('pages/AbrirChamado.vue') }
    ]
  },
  {
    path: '/situacaoChamado',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'situacaoChamado', component: () => import('pages/SituacaoChamado.vue') }
    ]
  },
  {
    path: '/gerenciarFila',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'gerenciarFila', component: () => import('pages/GerenciarFila.vue') }
    ]
  },
  {
    path: '/priorizarChamado',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'priorizarChamado', component: () => import('pages/PriorizarChamado.vue') }
    ]
  },
  {
    path: '/relatorios',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'relatorios', component: () => import('pages/Relatorios.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

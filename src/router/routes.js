
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'stats', component: () => import('pages/IndexPage.vue') },
      { path: 'abrirchamado', name: 'abrirChamado', component: () => import('pages/AbrirChamado.vue') },
      { path: 'situacaoChamado', name: 'situacaoChamado', component: () => import('pages/SituacaoChamado.vue') },
      { path: 'gerenciarFila', name: 'gerenciarFila', component: () => import('pages/GerenciarFila.vue') },
      { path: 'priorizarChamado', name: 'priorizarChamado', component: () => import('pages/PriorizarChamado.vue') },
      { path: 'relatorios', name: 'relatorios', component: () => import('src/pages/RelatoriosPage.vue') },
      { path: 'categorias', name: 'categorias', component: () => import('pages/GerenciarCategorias.vue') }
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


const routes = [
  {
    path: '/admin',
    component: () => import('layouts/MainLayoutAdmin.vue'),
    children: [
      { path: 'gerenciarFila', name: 'gerenciarFila', component: () => import('pages/GerenciarFila.vue') },
      { path: 'priorizarChamado', name: 'priorizarChamado', component: () => import('pages/PriorizarChamado.vue') },
      { path: 'relatorios', name: 'relatorios', component: () => import('src/pages/RelatoriosPage.vue') },
      { path: 'categorias', name: 'categorias', component: () => import('pages/GerenciarCategorias.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'chamados', component: () => import('src/pages/Chamados/ListCategoriasChamado.vue') },
      { path: 'abrirChamado/:id', name: 'abrirChamado', component: () => import('pages/Chamados/FormAbrirChamado.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

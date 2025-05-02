<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import moment from 'moment'

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const dataAtual = moment(Date.now()).format('DD/MM/YYYY')
    const linksList = [
      {
        title: 'Abrir Chamados',
        caption: '',
        icon: 'question_answer',
        routeName: 'chamados'
      },
      {
        title: 'Meus Chamados',
        caption: '',
        icon: 'task',
        routeName: 'listChamados'
      }
    ]
    return {
      essentialLinks: linksList,
      dataAtual,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

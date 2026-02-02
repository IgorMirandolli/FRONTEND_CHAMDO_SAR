<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
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
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import EssentialLink from "components/EssentialLink.vue";
import moment from "moment";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const dataAtual = moment(Date.now()).format("DD/MM/YYYY");

    // 🔹 IMPLEMENTAÇÃO (não muda lógica)
    onMounted(() => {
      if (!$q.localStorage.getItem("CD_USUARIO")) {
        // ID precisa existir na tabela USUARIOS
        $q.localStorage.set("CD_USUARIO", 1);
      }
    });

    const linksList = [
      {
        title: "Abrir Chamados",
        caption: "",
        icon: "question_answer",
        routeName: "chamados",
      },
      {
        title: "Chamados",
        caption: "",
        icon: "task",
        routeName: "listChamados",
      },
      {
        title: "Meus Chamados",
        caption: "",
        icon: "assignment_ind",
        routeName: "meusChamados",
      },
    ];

    return {
      essentialLinks: linksList,
      dataAtual,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

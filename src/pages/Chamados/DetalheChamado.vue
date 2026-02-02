<template>
  <q-page padding>
    <q-card
      class="q-mx-auto q-pa-md"
      style="max-width: 1000px; border-radius: 16px"
    >
      <!-- CABEÇALHO -->
      <q-card-section>
        <div class="row items-center justify-between">
          <div>
            <div class="text-h6">Chamado #{{ chamado.ID_CHAMADO }}</div>
            <div class="text-caption text-grey">
              Aberto em {{ formatDt(chamado.DT_ABERTURA) }}
            </div>
          </div>

          <q-chip color="primary" text-color="white" v-if="novoStatus === 'A'">
            Aberto
          </q-chip>
          <q-chip
            color="orange"
            text-color="white"
            v-else-if="novoStatus === 'T'"
          >
            Em andamento
          </q-chip>
          <q-chip color="green" text-color="white" v-else> Finalizado </q-chip>
        </div>
      </q-card-section>

      <!-- 👤 DADOS DAS PESSOAS -->
      <q-card-section class="q-pt-none">
        <q-list dense bordered class="rounded-borders">
          <q-item>
            <q-item-section>
              <q-item-label caption>Chamado aberto por</q-item-label>
              <q-item-label>
                {{ chamado.NM_USUARIO_ABERTURA || "Não informado" }}
              </q-item-label>
              <q-item-label caption>
                Setor: {{ chamado.DS_SETOR_ABERTURA || "-" }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="chamado.NM_USUARIO_RESPONSAVEL">
            <q-item-section>
              <q-item-label caption>Chamado em atendimento por</q-item-label>
              <q-item-label>
                {{ chamado.NM_USUARIO_RESPONSAVEL }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <!-- DESCRIÇÃO -->
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Descrição do chamado</div>
        <q-input
          type="textarea"
          :model-value="descricaoLimpa"
          readonly
          autogrow
          outlined
        />
      </q-card-section>

      <!-- ANEXOS -->
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Anexos</div>

        <q-list bordered v-if="anexos.length">
          <q-item
            v-for="a in anexos"
            :key="a.ID_ARQUIVO"
            clickable
            tag="a"
            :href="getArquivoUrl(a.DS_CAMINHO_ARQUIVO)"
            target="_blank"
          >
            <q-item-section>
              {{ nomeArquivo(a.DS_CAMINHO_ARQUIVO) }}
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="text-grey">Nenhum anexo</div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <!-- 💬 CHAT -->
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">Conversa do chamado</div>

        <div
          class="q-pa-sm bg-grey-2"
          style="max-height: 300px; overflow-y: auto; border-radius: 10px"
        >
          <div
            v-for="c in comentarios"
            :key="c.ID_COMENTARIO"
            class="q-mb-sm"
            :class="{ 'text-right': c.CD_USUARIO === usuarioLogado }"
          >
            <q-chip
              :color="c.CD_USUARIO === usuarioLogado ? 'primary' : 'grey-5'"
              text-color="white"
            >
              {{ c.NM_COMPLETO_USUARIO || "Usuário" }}
            </q-chip>

            <div
              class="q-pa-sm q-mt-xs"
              style="border-radius: 8px"
              :class="{
                'bg-primary text-white': c.CD_USUARIO === usuarioLogado,
                'bg-white': c.CD_USUARIO !== usuarioLogado,
              }"
            >
              {{ c.DS_COMENTARIO }}
            </div>

            <div class="text-caption text-grey q-mt-xs">
              {{ formatDt(c.DT_COMENTARIO) }}
            </div>
          </div>

          <div v-if="!comentarios.length" class="text-grey text-center">
            Nenhum comentário ainda
          </div>
        </div>

        <div class="row q-mt-md q-gutter-sm">
          <q-input
            v-model="novoComentario"
            outlined
            dense
            placeholder="Digite sua mensagem..."
            class="col"
            :disable="!podeComentar"
            @keyup.enter="enviarComentario"
          />
          <q-btn
            icon="send"
            color="primary"
            :disable="!podeComentar"
            @click="enviarComentario"
          />
        </div>

        <div v-if="!podeComentar" class="text-caption text-grey q-mt-xs">
          Comentários só podem ser feitos quando o chamado estiver em andamento
        </div>
      </q-card-section>

      <!-- AÇÕES -->
      <q-card-actions align="right">
        <q-btn flat label="Voltar" @click="$router.back()" />

        <!-- ACEITAR CHAMADO -->
        <q-btn
          v-if="novoStatus === 'A'"
          color="primary"
          label="Aceitar chamado"
          @click="aceitarChamado"
        />

        <!-- FINALIZAR CHAMADO -->
        <q-btn
          v-if="novoStatus === 'T'"
          color="primary"
          label="Finalizar chamado"
          @click="finalizarChamado"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { formatDt } from "src/util/format";
import useNotify from "src/composables/UseNotify";

const route = useRoute();
const $q = useQuasar();
const { notifyError, notifySuccess } = useNotify();

const chamado = ref({});
const anexos = ref([]);
const comentarios = ref([]);
const novoComentario = ref("");
const novoStatus = ref(null);

const usuarioLogado = $q.localStorage.getItem("CD_USUARIO");

onMounted(async () => {
  try {
    const id = route.params.id;

    const { data } = await api.get(`/chamados/${id}`);

    if (!data || !data.ID_CHAMADO) {
      notifyError("Chamado não encontrado");
      return;
    }

    chamado.value = data;
    novoStatus.value = data.ST_CHAMADO;

    if (chamado.value.CD_USUARIOS_ABERTURA) {
      const u = await api.get(`usuario/${chamado.value.CD_USUARIOS_ABERTURA}`);

      if (u.data?.length) {
        const usuario = u.data[0];
        chamado.value.NM_USUARIO_ABERTURA = usuario.NM_COMPLETO_USUARIO;

        if (usuario.ID_SETOR) {
          const s = await api.get(`setor/${usuario.ID_SETOR}`);
          if (s.data?.NM_SETOR) {
            chamado.value.DS_SETOR_ABERTURA = s.data.NM_SETOR;
          }
        }
      }
    }

    if (chamado.value.CD_USUARIOS_RESPONSAVEL) {
      const r = await api.get(
        `usuario/${chamado.value.CD_USUARIOS_RESPONSAVEL}`,
      );
      if (r.data?.length) {
        chamado.value.NM_USUARIO_RESPONSAVEL = r.data[0].NM_COMPLETO_USUARIO;
      }
    }

    const anexosResp = await api.get(`anexos/chamado/${id}`);
    anexos.value = anexosResp.data;

    await carregarComentarios();
  } catch {
    notifyError("Erro ao carregar chamado");
  }
});

/* REGRAS */
const isChamadoEmAndamento = computed(() => novoStatus.value === "T");
const podeComentar = computed(() => isChamadoEmAndamento.value);

/* CHAT */
const carregarComentarios = async () => {
  const { data } = await api.get(`chamados/${route.params.id}/comentarios`);
  comentarios.value = data;
};

const enviarComentario = async () => {
  if (!novoComentario.value || !podeComentar.value) return;

  try {
    await api.post(`chamados/${chamado.value.ID_CHAMADO}/comentarios`, {
      CD_USUARIO: usuarioLogado,
      DS_COMENTARIO: novoComentario.value,
    });

    novoComentario.value = "";
    await carregarComentarios();
  } catch {
    notifyError("Erro ao enviar comentário");
  }
};

/* FINALIZAR CHAMADO */
const finalizarChamado = () => {
  $q.dialog({
    title: "Finalizar chamado",
    message: "Tem certeza que deseja finalizar este chamado?",
    cancel: true,
    persistent: true,
    ok: {
      label: "Finalizar",
      color: "green",
    },
    cancel: {
      label: "Cancelar",
      color: "grey",
    },
  }).onOk(async () => {
    try {
      await api.put(`chamados/${chamado.value.ID_CHAMADO}/finalizar`);

      novoStatus.value = "F";
      notifySuccess("Chamado finalizado com sucesso");
    } catch {
      notifyError("Erro ao finalizar chamado");
    }
  });
};

const aceitarChamado = () => {
  $q.dialog({
    title: "Aceitar chamado",
    message: "Deseja assumir este chamado?",
    cancel: true,
    persistent: true,
    ok: {
      label: "Aceitar",
      color: "primary",
    },
    cancel: {
      label: "Cancelar",
      color: "grey",
    },
  }).onOk(async () => {
    try {
      await api.put(`chamados/${chamado.value.ID_CHAMADO}`, {
        ST_CHAMADO: "T",
        CD_USUARIOS_RESPONSAVEL: usuarioLogado,
      });

      novoStatus.value = "T";
      chamado.value.NM_USUARIO_RESPONSAVEL = "Você";

      notifySuccess("Chamado aceito com sucesso");
    } catch {
      notifyError("Erro ao aceitar chamado");
    }
  });
};

/* UTIL */
const stripHtml = (html = "") =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .trim();

const descricaoLimpa = computed(() => stripHtml(chamado.value.DS_CHAMADO));
const nomeArquivo = (path) => path.split("/").pop();
const getArquivoUrl = (path) => `http://localhost:3002/${path}`;
</script>

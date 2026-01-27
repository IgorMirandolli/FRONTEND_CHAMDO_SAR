<template>
  <q-page padding>
    <q-card class="q-mx-auto" style="max-width: 900px">
      <q-card-section>
        <div class="text-h6">Chamado #{{ chamado.ID_CHAMADO }}</div>
        <div class="text-caption text-grey">
          Aberto em {{ formatDt(chamado.DT_ABERTURA) }}
        </div>
      </q-card-section>

      <q-separator />

      <!-- DESCRIÇÃO -->
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Descrição</div>
        <q-input
          type="textarea"
          :model-value="descricaoLimpa"
          readonly
          autogrow
        />
      </q-card-section>

      <!-- STATUS -->
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Status</div>
        <q-select
          v-model="novoStatus"
          :options="statusOptions"
          emit-value
          map-options
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

      <!-- AÇÕES -->
      <q-card-actions align="right">
        <q-btn flat label="Voltar" @click="$router.back()" />
        <q-btn color="primary" label="Salvar status" @click="salvarStatus" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { formatDt } from "src/util/format";
import useNotify from "src/composables/UseNotify";

const route = useRoute();
const { notifyError, notifySuccess } = useNotify();

const chamado = ref({});
const anexos = ref([]);
const novoStatus = ref(null);

const statusOptions = [
  { label: "Aberto", value: "A" },
  { label: "Andamento", value: "T" },
  { label: "Finalizado", value: "F" },
];

onMounted(async () => {
  try {
    const id = route.params.id;

    const { data } = await api.get(`chamados/${id}`);
    chamado.value = data;
    novoStatus.value = data.ST_CHAMADO;

    const anexosResp = await api.get(`anexos/chamado/${id}`);
    anexos.value = anexosResp.data;
  } catch (err) {
    notifyError("Erro ao carregar chamado");
  }
});

const salvarStatus = async () => {
  try {
    await api.put(`chamados/${chamado.value.ID_CHAMADO}`, {
      ST_CHAMADO: novoStatus.value,
    });

    notifySuccess("Status atualizado com sucesso");
  } catch (err) {
    notifyError("Erro ao atualizar status");
  }
};

/* 🔽 IMPLEMENTAÇÃO NECESSÁRIA */
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

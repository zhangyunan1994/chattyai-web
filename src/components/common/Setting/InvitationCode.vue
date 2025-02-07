<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import { NSpin, useMessage } from 'naive-ui'
import { copyToClip } from '@/utils/copy'

import { fetchMemberInfo, fetchMemberInvitation } from '@/api'

const message = useMessage()
const loading = ref(false)
const data = ref([])
const page = ref(1)
const totalPage = ref(1)

interface InvitationMemberInfo {
  nickname: string
  username: string
  invitationDate: string
}
interface PageRecord {
  currentPage: number
  totalPage: number
  dataList: InvitationMemberInfo[]
}

const invitationMemberInfos = ref<InvitationMemberInfo[]>([])
const memberInfo = ref<Settings.MemberInfo>({})

async function getMemberInfo() {
  const { data } = await fetchMemberInfo<Settings.MemberInfo>()
  memberInfo.value = data
}

async function fetchInvitationRecord() {
  try {
    loading.value = true
    const { data } = await fetchMemberInvitation<PageRecord>(page.value, 10)
    page.value = data.currentPage
    totalPage.value = data.totalPage
    invitationMemberInfos.value = data.dataList
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getMemberInfo()
  fetchInvitationRecord()
})

function pageChange(pageIndex: number) {
  page.value = pageIndex
  fetchInvitationRecord()
}

const columns = reactive([
  {
    title: '名称',
    key: 'nickname',
  },
  {
    title: '账号',
    key: 'username',
  },
  {
    title: '时间',
    key: 'invitationDate',
  },
])

const copyCode = function () {
  copyToClip('sf=G8AZGXCWG')
  message.success('复制成功')
}
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-5 min-h-[200px]">
      <div class="space-y-6">
        <div class="max-w-screen-lg space-y-4">
          <n-alert type="success">
            邀请新用户注册将获得 66666 Token
          </n-alert>
          <n-card size="small">
            ChattyAI 邀请限时开放，请抓紧叫上朋友来使用。（为保证所有付费用户的使用体验，邀请功能会根据 ChattyAI
            的处理能力随时关闭。切勿使用非正常手段进行伪造邀请，一经发现，将会对账号清理 Token，并永久封禁 ChattyAI 的使用权限。）
          </n-card>
          <n-card title="邀请码" size="small">
            <n-space>
              <NH2>{{ memberInfo.invitationCode }}</NH2>
              <NButton ghost @click="copyCode">
                复制邀请链接
              </NButton>
            </n-space>
          </n-card>
          <n-card title="邀请记录" size="small">
            <n-space vertical>
              <n-data-table :columns="columns" :data="invitationMemberInfos" />
              <n-pagination v-model:page="page" v-model:page-count="totalPage" :on-update:page="pageChange" />
            </n-space>
          </n-card>
        </div>
      </div>
    </div>
  </NSpin>
</template>

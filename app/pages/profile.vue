<script setup lang="ts">
import type { User } from '~/utils/types'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Profile · OnlyWeebs' })

// Mirrors the API's constraints on POST /api/me/profile-picture.
const MAX_SIZE = 5 * 1024 * 1024
const MAX_DIMENSION = 2000
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const api = createApiClient()
const { user } = useAuth()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const preview = ref<string | null>(null)
const uploading = ref(false)
const error = ref('')
const success = ref(false)
const dragging = ref(false)

const memberSince = computed(() => formatDate(user.value?.createdAt))

function clearSelection() {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = null
  file.value = null
  if (fileInput.value) fileInput.value.value = ''
}

onBeforeUnmount(clearSelection)

function imageSize(url: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}

async function select(selected: File | undefined) {
  error.value = ''
  success.value = false
  clearSelection()
  if (!selected) return

  if (!ACCEPTED_TYPES.includes(selected.type)) {
    error.value = 'Please upload a valid image (JPEG, PNG, or WebP).'
    return
  }
  if (selected.size > MAX_SIZE) {
    error.value = 'The image must be 5 MB or smaller.'
    return
  }

  const url = URL.createObjectURL(selected)
  try {
    const { width, height } = await imageSize(url)
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      URL.revokeObjectURL(url)
      error.value = `The image cannot exceed ${MAX_DIMENSION}×${MAX_DIMENSION}px (this one is ${width}×${height}px).`
      return
    }
  }
  catch {
    URL.revokeObjectURL(url)
    error.value = 'This file could not be read as an image.'
    return
  }

  file.value = selected
  preview.value = url
}

function onChange(event: Event) {
  select((event.target as HTMLInputElement).files?.[0])
}

function onDrop(event: DragEvent) {
  dragging.value = false
  select(event.dataTransfer?.files?.[0])
}

async function upload() {
  if (!file.value) return

  uploading.value = true
  error.value = ''
  try {
    const body = new FormData()
    body.append('profile_picture', file.value)
    const res = await api<{ data: User }>('/me/profile-picture', { method: 'POST', body })
    user.value = res.data
    clearSelection()
    success.value = true
  }
  catch (e) {
    error.value = apiErrorMessage(e, 'Failed to upload the picture. Please try again.')
  }
  finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="profile">
    <h1><i class="fa-solid fa-circle-user" /> Profile</h1>

    <ClientOnly>
      <template #fallback>
        <div class="state"><i class="fa-solid fa-spinner fa-spin" /> Loading…</div>
      </template>

      <template v-if="user">
        <section class="card account">
          <UserAvatar :image="user.profilePic" :size="96" />
          <div class="account-info">
            <h2>{{ user.username || user.email }}</h2>
            <p v-if="user.username" class="muted"><i class="fa-solid fa-envelope" /> {{ user.email }}</p>
            <p class="muted"><i class="fa-solid fa-calendar" /> Member since {{ memberSince }}</p>
            <p v-if="user.roles.includes('ROLE_ADMIN')"><span class="tag"><i class="fa-solid fa-shield-halved" /> Admin</span></p>
          </div>
        </section>

        <section class="card upload">
          <h2><i class="fa-solid fa-camera" /> Profile picture</h2>

          <div v-if="error" class="alert" role="alert">{{ error }}</div>
          <p v-if="success" class="success"><i class="fa-solid fa-circle-check" /> Profile picture updated.</p>

          <label
            class="dropzone"
            :class="{ dragging }"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <input
              ref="fileInput"
              type="file"
              :accept="ACCEPTED_TYPES.join(',')"
              class="sr-only"
              @change="onChange"
            >
            <img v-if="preview" :src="preview" alt="Preview" class="preview">
            <template v-else>
              <i class="fa-solid fa-cloud-arrow-up" />
              <span><strong>Click to choose</strong> or drag an image here</span>
            </template>
            <span class="muted hint">JPEG, PNG or WebP · max 5 MB · max {{ MAX_DIMENSION }}×{{ MAX_DIMENSION }}px</span>
          </label>

          <div v-if="file" class="upload-actions">
            <span class="muted file-name">{{ file.name }}</span>
            <button class="btn" type="button" :disabled="uploading" @click="clearSelection">
              <i class="fa-solid fa-xmark" /> Cancel
            </button>
            <button class="btn btn-primary" type="button" :disabled="uploading" @click="upload">
              <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-upload'" /> Upload
            </button>
          </div>
        </section>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.profile {
  max-width: 640px;
  margin: 0 auto;
}

.card {
  padding: 24px;
  margin-bottom: 20px;
}

.card h2 {
  margin: 0 0 12px;
  font-size: 1.2rem;
}

.account {
  display: flex;
  align-items: center;
  gap: 20px;
}

.account-info {
  min-width: 0;
}

.account-info h2 {
  margin: 0 0 4px;
  overflow-wrap: anywhere;
}

.account-info p {
  margin: 2px 0;
}

.success {
  color: var(--success);
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 200px;
  padding: 24px;
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  text-align: center;
  cursor: pointer;
}

.dropzone:hover,
.dropzone.dragging {
  border-color: var(--primary);
  background: var(--surface-2);
}

.dropzone > i {
  font-size: 2.2rem;
  color: var(--primary);
}

.preview {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}

.hint {
  font-size: 0.8rem;
}

.upload-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.file-name {
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

@media (max-width: 480px) {
  .account {
    flex-direction: column;
    text-align: center;
  }
}
</style>

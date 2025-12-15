<template>
  <div class="upload-box">
    <el-upload
      action="#"
      :id="id"
      :class="['upload', drag ? 'no-border' : '']"
      :multiple="false"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :drag="drag"
      accept="image/*"
    >
      <template v-if="imageUrl">
        <img :src="imageUrl" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <div class="handle-icon" @click="handleImageView">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div class="handle-icon" @click="handleRemove" v-if="!disabled">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <el-icon><Plus /></el-icon>
          </slot>
        </div>
      </template>
    </el-upload>

    <el-image-viewer
      v-if="imageViewVisible"
      :url-list="[imageUrl]"
      @close="imageViewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadImg } from '@/api/modules/upload' // 引入刚才写的 Mock 接口
import { Plus, Delete, ZoomIn } from '@element-plus/icons-vue'
import type { UploadRequestOptions, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

// 定义 props (双向绑定 fileUrl)
interface UploadFileProps {
  imageUrl: string // 父组件传进来的图片地址 (v-model:imageUrl)
  api?: (params: any) => Promise<any> // 可以在这里覆盖默认上传接口
  drag?: boolean // 是否支持拖拽
  disabled?: boolean // 是否禁用
  fileSize?: number // 限制大小 (MB)
  fileType?: string[] // 限制类型
  id?: string
}

// 默认值
const props = withDefaults(defineProps<UploadFileProps>(), {
  imageUrl: '',
  drag: true,
  disabled: false,
  fileSize: 5, // 默认最大 5MB
  fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
})

// 定义 emit 用于更新 v-model
const emits = defineEmits(['update:imageUrl'])

const imageViewVisible = ref(false)

// 1. 核心上传逻辑
const handleHttpUpload = async (options: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('file', options.file)
  try {
    // 调用 Mock 接口
    const api = props.api || uploadImg
    const { data } = await api(formData)

    // 上传成功，把返回的 URL (Base64) 传给父组件
    emits('update:imageUrl', data.fileUrl)
    ElMessage.success('上传成功')
  } catch (error) {
    options.onError(error as any)
  }
}

// 2. 移除图片
const handleRemove = () => {
  emits('update:imageUrl', '')
}

// 3. 查看大图
const handleImageView = () => {
  imageViewVisible.value = true
}

// 4. 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType.includes(rawFile.type)
  if (!imgType) ElMessage.warning('上传图片不符合所需的格式！')
  if (!imgSize) ElMessage.warning(`上传图片大小不能超过 ${props.fileSize}M！`)
  return imgType && imgSize
}
</script>

<style scoped>
.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.el-upload) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    overflow: hidden;
    border: 1px dashed var(--el-border-color-darker);
    border-radius: var(--el-border-radius-base);
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
      .upload-handle {
        opacity: 1;
      }
    }
    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-text-color-secondary);
      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      transition: var(--el-transition-duration-fast);
      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;
        .el-icon {
          margin-bottom: 40%;
          font-size: 130%;
          line-height: 130%;
        }
        span {
          font-size: 85%;
          line-height: 85%;
        }
      }
    }
  }
}
</style>

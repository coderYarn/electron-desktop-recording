<template>

  <Layer>
    <div class="recordMain">
      <div class="content">
        <div class="btnBox">
          <div>
            <div class="btn" @click="sourceStart">
              {{ isRecord ? '结束录制' : '录屏' }}
            </div>
            <div class="timer">{{ transTime(timestamp) }}</div>
          </div>
        </div>
        <div class="videoList">
          <div class="list">
            <div class="table">
                     <div class="table-line" >
                <div>片原名</div>
                <div>
                  播放
                </div>
                <div >打开文件目录</div>
              </div>
              <div class="table-line" :key="item" v-for="item in files">
                <div>{{ item }}</div>
                <div @click="handlerPlay(item)" v-if="sourceList.length > 0 ? true : false">
                  播放
                </div>
                <div @click="openDir(item)">打开文件目录</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="preview">
        <!-- <video :src="previewImg"></video> -->
        <img :src="previewImg" v-if="videoUrl === ''" />
        <video controls :src="`http://localhost:9000/${videoUrl}`" v-else></video>
      </div>
    </div>

    <RecordList @exitDia="exitDia" @recrodWin="recrodWin" :sourceList="sourceList" :show="show" />
  </Layer>
</template>

<script>
import Layer from '../components/Layer/Layer.vue'
import RecordList from '../components/Layer/RecordList.vue'
import { ref, defineComponent } from 'vue'
import { saveVideo, directoryFiles } from '../utils/helper'

const { ipcRenderer } = window.require('electron')
const getSource = () => {
  return new Promise((resolve) => {
    ipcRenderer.send('resolve-desktop')

    ipcRenderer.on('reply-sorce', (event, data) => {
      resolve(data)
    })
  })
}
export default defineComponent({
  components: {
    Layer,
    RecordList
  },
  setup () {
    const previewImg = ref('')
    const isRecord = ref(false)
    const recorder = ref(null)
    const files = ref([])
    const timer = ref(null)
    const timestamp = ref(0)
    const sourceList = ref([])
    const sourceId = ref(null)
    const show = ref(false)
    const countDown = () => {
      timestamp.value++
      timer.value = setTimeout(() => {
        countDown()
      }, 1000)
    }
    const transTime = (time) => {
      const h =
        Math.floor(time / 3600) < 10
          ? '0' + Math.floor(time / 3600)
          : Math.floor(time / 3600)
      const m =
        Math.floor((time / 60) % 60) < 10
          ? '0' + Math.floor((time / 60) % 60)
          : Math.floor((time / 60) % 60)
      const s =
        Math.floor(time % 60) < 10
          ? '0' + Math.floor(time % 60)
          : Math.floor(time % 60)
      return `${h}:${m}:${s}`
    }
    files.value = directoryFiles()
    const getPreview = async () => {
      const source = await getSource()

      previewImg.value = source[0].thumbnail.toDataURL() // 'source.thumbnail.toDataURL()'
    }

    const recordStart = (stream) => {
      countDown()
      isRecord.value = true
      const blobSlice = []
      recorder.value = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })

      if (recorder.value) {
        recorder.value.start(1000)
        recorder.value.ondataavailable = (event) => {
          blobSlice.push(event.data)
        }
        recorder.value.onstop = async (event) => {
          isRecord.value = false
          const blob = new Blob([...blobSlice], {
            type: 'video/webm'
          })

          saveVideo(blob).then(() => {
            alert('保存成功')
            files.value = directoryFiles()
          })
        }
        recorder.value.onerror = (err) => {
          console.log(err)
        }
      }
    }
    const sourceStart = async () => {
      if (show.value) return
      const source = await getSource()

      sourceList.value = source.map((item) => {
        return {
          url: item.thumbnail.toDataURL(),
          id: item.id
        }
      })

      if (isRecord.value) {
        show.value = false
        ipcRenderer.send('stopRecord')
      } else {
        show.value = true
      }
    }
    ipcRenderer.on('record-stop', () => {
      timer.value && clearTimeout(timer.value)
      timestamp.value = 0
      recorder.value && recorder.value.stop()
    })
    ipcRenderer.on('record-start', async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId.value,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      })
      console.log('record-start')
      recordStart(stream)
    })
    const videoUrl = ref('')
    const handlerPlay = (item) => {
      videoUrl.value = item
    }
    const openDir = (item) => {
      ipcRenderer.send('directory-open', item)
    }
    const exitDia = (flag) => {
      show.value = flag
    }
    const recrodWin = (item) => {
      sourceId.value = item.id
      show.value = item.show
      if (!isRecord.value) {
        ipcRenderer.send('startRecord')
      }
    }
    getPreview()
    return {
      previewImg,
      recordStart,
      sourceStart,
      isRecord,
      files,
      timestamp,
      transTime,
      handlerPlay,
      videoUrl,
      openDir,
      sourceList,
      show,
      recrodWin,
      exitDia
    }
  }
})
</script>

<style scope>
.recordMain {
  width: 100%;
  height: 100%;
  display: flex;
}

.content {
  width: 40%;
}

.preview {
  display: flex;
  align-items: center;
  width: 60%;
  height: calc(100vh - 50px);
  padding: 10px;
  box-sizing: border-box;
}

.btnBox {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  background: red;
  width: 8vh;
  height: 8vh;
  border-radius: 50%;
  text-align: center;
  line-height: 8vh;
  color: #fff;
  font-weight: bold;
}

.videoList {
  height: calc(80vh - 50px);
  padding: 15px;
  box-sizing: border-box;
}

.list {
  border: solid 1px red;
  height: 100%;
  border-radius: 10px;
  overflow-y: scroll;
}

.table {
  padding: 0 10px;
  box-sizing: border-box;
}

.table-line {
  display: flex;
  justify-content: space-around;
  border-bottom: solid red 1px;
  height: 30px;
  align-items: center;
}

img {
  width: 100%;
  background: #ccc;
  background-size: cover;
}

video {
  width: 100%;
  background: #ccc;
  background-size: cover;
}

.item {
  cursor: pointer;
}
</style>

<script setup>
import MemoHttpService from '@/service/MemoHttpService';
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const state = reactive({
  memo: {
    id: "0",
    title: "",
    content: "",
    createdAt: "",
    image: ""
  }
});

const isUpdateMode = route.params.id !== undefined;

const imageUpload = ref([]);
const previewImage = ref(null);
const showImages = ref([]);

onMounted( async () => {
    if (isUpdateMode) {
    const id = route.params.id;
    const { resultData } = await MemoHttpService.findById(id);
    state.memo = resultData;
  }
});

const save = async() => {
    const save = {
        title: state.memo.title,
        content: state.memo.content,
        image: state.memo.image,
    };

    let result;

    if (isUpdateMode) {
        result = await MemoHttpService.modify(state.memo.id, save);
    } else {
        result = await MemoHttpService.create(save);
    }

    if(result.resultData === 1) {
        alert(isUpdateMode ? "메모가 수정되었습니다." : "메모가 등록되었습니다.");
        router.push("/otd/memo");
    }
};

const remove = async () => {
    if(!confirm("삭제하시겠습니까?")) return;
    const result = await MemoHttpService.deleteById(state.memo.id);
    if(result.resultData === 1) {
        alert("삭제되었습니다.");
        router.push("/otd/memo");
    }
};

const handleImageChange = async (e) => {
  const files = e.target.files;
  if(!files || files.length === 0) return;

  let imageUrlLists = [...showImages.value];

  for(let i=0; i<files.length; i++) {
    const file = files[i];
    const currentImageUrl = URL.createObjectURL(file);
    imageUrlLists.push(currentImageUrl);
  
    const formData = new FormData();
    formData.append('image', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if(i === 0 && data.imageUrl) {
      state.memo.image = data.imageUrl;
    }
    console.log("이미지 데이터 성공", data.imageUrl);
  } catch (error) {
    console.log("이미지 업로드 실패", error);
  }
}

if (imageUrlLists.length > 5) {
  imageUrlLists = imageUrlLists.slice(0, 5);
}

showImages.value = imageUrlLists;
};

const removeImage = (index) => {
  showImages.value.splice(index, 1);
};

function checkFileSize() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const maxSizeInBytes = 5 * 2048 * 2048; // 5MB

    if (file && file.size > maxSizeInBytes) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      fileInput.value = ''; // 파일 선택 초기화
    }
  }
</script>

<template>
    <div class="memo-detail mb-3">
      <div class="mb-3"> <label>제목</label>
        <input type="text" class="form-control" v-model="state.memo.title" />
      </div>
      <div class="mb-3">
      <label>내용</label>
      <textarea class="form-control" rows="5" v-model="state.memo.content"></textarea>
      </div>
      </div>
      <div class="mb-3">
        <label>이미지 업로드(최대 5장)</label>
        <input type="file" id="fileInput" onchange="checkFileSize()">
        <input type="file" multiple class="form-control" @change="handleImageChange" />
        <div class="preview-list">
      <div v-for="(img, index) in showImages" :key="index" class="preview">
        <img :src="img" />
        <button class="remove-btn" @click="removeImage(index)">X</button>
      </div>
    </div>
      <div class="mb-3" v-if="state.memo.createdAt">
        <strong>등록일시:</strong> {{ state.memo.createdAt }}</div>
      <button class="btn btn-primary w-100 py-3 mt-4" style="border: none;" @click="save">
        {{ isUpdateMode ? "수정 완료" : "등록" }}</button>
  
      <button v-if="isUpdateMode" class="btn btn-danger w-100 py-3 mt-3"
        @click="remove">삭제</button>
    </div>
  </template>
  
  <style scoped>
  
  .mb-3 {
    margin-bottom: 1rem;
    font-weight: 400;
  }
  .btn {
    background-color: skyblue;
    color: black;
    text-align: center;
    font-weight: 600;
  }
  .btn:hover {
    background-color: #a3cfd4;
    color: black;
  }
  .upload-box {
  margin: 20px 0;
}
.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.preview {
  position: relative;
}
.preview img {
  width: 100px;
  height: auto;
  border-radius: 4px;
  display: block;
}
.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  font-weight: bold;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
  </style>
<script setup>
import MemoHttpService from '@/service/MemoHttpService';
import { reactive, onMounted } from "vue";
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

onMounted( async () => {
    if (isUpdateMode) {
    const id = route.params.id;
    const { resultData } = await MemoHttpService.findById(id);
    state.memo = data.resultData;
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
</script>

<template>
    <div class="memo-detail mb-3">
      <div class="mb-3"> <label>제목</label>
        <input type="text" class="form-control" v-model="state.memo.title" />
      </div>
      <div class="mb-3"> <label>내용</label>
        <textarea class="form-control" rows="5" v-model="state.memo.content" />
      </div>
      <div class="mb-3">
        <label>이미지 URL</label>
        <input type="text" class="form-control" v-model="state.memo.image" /></div>
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
  </style>
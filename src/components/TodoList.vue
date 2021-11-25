<template>
  <div>
    <div class="row">
      <div class="col">
        <h2>{{ title }}</h2>

        <ul class="list-group mb-3">
          <li
            v-for="todo in todosFromServer"
            :key="todo"
            class="list-group-item"
            @click="getTodo(todo._id)"
          >
            {{ todo.title }} {{ todo.status }}

          <button @click="updateOne(todo._id)" type="submit" class="btn btn-dark mx-5">Märgi tehtuks</button>

          <button @click="deleteOne(todo._id)" type="submit" class="btn btn-dark mx-5">Kustuta task</button>
          </li>
        </ul>
       
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input
          v-model="newTodo"
          type="text"
          name="newTodo"
          class="form-control"
        />
      </div>
      <div class="col">
        <button @click="addTodo" type="submit" class="btn btn-primary w-100">
          Add new todo
        </button>
      </div>
    </div>
    {{ singleTodo }}
     <!-- (kuvab konkreetse todo sisu) -->
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "TodoList",
  props: {
    title: String,
  },
  setup() {
    const todos = ref(["Read a book", "Go for a walk", "Eat food"]);
    const newTodo = ref("");

    const todosFromServer = ref([]);
    const singleTodo = ref({}); //muutuja salvestuseks, kui id põhiselt otsida, et ananks tulemuse?

    async function getTodos() {
      const result = await axios.get("/api/get-todos");
      todosFromServer.value = result.data;
      console.log(result.data);
    }

    async function getTodo(id) {
      const result = await axios.get("/api/get-todo/" + id);
      singleTodo.value = result.data;
      console.log(result.data);
      
    }

    async function addTodo() {
      await axios.post("/api/add-todo", {
        title: newTodo.value,
        status: "ACTIVE",
      });
      newTodo.value = ""; /*tühjendab lahtri pärast lisamist, muidu jätaks eelmise sisestatud alles*/
      await getTodos();
    }

// Delete -OK,
    async function deleteOne(id) {
      const result = await axios.get("/api/delete-todo/" + id)
      todosFromServer.value = result.data;
      console.log(result.data);
      getTodos();
    
  }

  getTodos(); //topelt?

// /*allolevat ei kasutata, see on ainult siis kui BE/db taga ei ole*/
//     function addNewTodo() {
//       todos.value.push(newTodo.value);
//       newTodo.value = "";
//     }

  return {
      todos,
      newTodo,
      // addNewTodo,
      todosFromServer,
      addTodo,
      singleTodo,
      getTodo,
      deleteOne,
      // updateOne
    };
  },
};
</script>
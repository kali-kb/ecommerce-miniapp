<script setup>
import { useRouter } from 'vue-router';
import { Search, X } from 'lucide-vue-next'
import { onMounted, watch, ref } from "vue"
import Spinner from "../components/Spinner.vue"
import formatPrice from "../../utils"
import _ from "lodash"


const router = useRouter()
const currentUser = ref(null)
const isSearching = ref(false)
const activeCategory = ref(null)
const searchTerm = ref("")
const categories = ref(null)
const products = ref(null)
const isFetching = ref({
  products: false,
  categories: false
})



const parseParams = (initData) => {
  const decodedData = decodeURIComponent(initData);
  const data = Object.fromEntries(new URLSearchParams(decodedData));
  data.user = JSON.parse(data.user);
  return data
}


const fetchByCategory = async(categoryId) => {
  activeCategory.value = categoryId
  const productsUrl = `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}/products`
  try {
    const response = await fetch(productsUrl);
    if (response.ok) {
      const data = await response.json();
      products.value = data;
    } else {
      console.error("Failed to fetch products.");
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}


const fetchAllProducts = async() => {
  activeCategory.value = null
  isFetching.value.products = true
  const productsUrl = `${import.meta.env.VITE_BACKEND_URL}/products`
  try {
    const response = await fetch(productsUrl);
    if (response.ok) {
      const data = await response.json();
      products.value = data;
      isSearching.value = false
    } else {
      console.error("Failed to fetch products.");
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isFetching.value.products = false
  }
}


const loadData = async () => {
  isFetching.value.products = true
  const productsUrl = `${import.meta.env.VITE_BACKEND_URL}/products`
  const categoriesUrl = `${import.meta.env.VITE_BACKEND_URL}/categories`
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(productsUrl),
      fetch(categoriesUrl)
    ]);
    if (productsResponse.ok && categoriesResponse.ok) {
      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      products.value = productsData;
      categories.value = categoriesData;
      console.log(products.value)
    } else {
      console.error("One of the responses failed.");
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isFetching.value.products = false
    isFetching.value.categories = false
  }
};


const handleSearch = async () => {
  if (searchTerm.value !== "") {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/products?search=${searchTerm.value}`
      const response = await fetch(url);
      products.value = await response.json();
      isSearching.value = false
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  } else {
    fetchAllProducts()
    // searchResults.value = [];
  }
};

// Debounce the search function with 300ms delay
const debouncedSearch = _.debounce(handleSearch, 2000);

const clearInput = () => { 
  searchTerm.value = ''
  fetchAllProducts()
}

onMounted(() => {
  if (window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.expand();
    webApp.BackButton.hide();
    webApp.MainButton.hide();
    const { user } = parseParams(webApp.initData)
    currentUser.value = user
    console.log(currentUser.value)
  } else {
    console.error('Telegram WebApp not initialized');
  }
  loadData()
})

watch(searchTerm, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    isSearching.value = true
  }
});

</script>

<template>
  <div class="border-[1px] sticky top-0 z-50 justify-between backdrop-blur-md border-black gap-4 pt-8 pr-4 pl-4 pb-8 flex items-center">
    <div name="search-input-container" class="bg-[#363A47] pl-2 rounded-xl flex flex-grow items-center">
      <Search class="text-gray-400" :size="20" />
      <input v-model="searchTerm" @input="debouncedSearch" placeholder="Search Products"
      class="w-auto caret-blue-500 h-10 outline-none text-white bg-[#363A47] pt-5 pb-5 pl-2"></input>
      <X class="text-gray-400" @click="clearInput" v-if="searchTerm !== '' && !isSearching" :size="20" />
      <Spinner :loading="isSearching"/>
    </div>
    <div name="avatar-container">
      <img class="h-8 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 ring-offset-black" alt="avatar"
        :src="`https://api.dicebear.com/9.x/initials/svg?seed=${currentUser ? currentUser.username : 'user'}`" />
    </div>
  </div>
  <div class="pr-4 pl-4 pt-5">
    <h1 class="text-white text-xl font-bold">Categories</h1>
    <div name="category-list-buttons" class="pt-4 pb-4 pl-1 flex gap-3 overflow-x-scroll">
      <button @click="fetchAllProducts" :class="['bg-[#363A47] text-white pr-5 pl-5 pt-1 pb-1 font-bold rounded-md h-8 text-sm', !activeCategory ? 'ring-blue-500 ring-2' : '']">All</button>
      <button v-if="categories" v-for="category in categories" :key="category.id" @click="fetchByCategory(category.id)" :class="['bg-[#363A47] text-sm text-white px-5 py-1 h-8 font-bold rounded-md w-auto shrink-0', activeCategory == category.id ? 'ring-blue-500 ring-2' : '']">{{ category.name }}</button>
      <button v-else v-for="_ in 5" class="bg-[#363A47] text-white pr-5 pl-5 pt-1 pb-1 font-bold rounded-md">
        <div class="h-2 w-10 rounded bg-gray-600"></div>
      </button>
    </div>
  </div>

  <div>
    <h1 class="text-white text-xl font-bold pl-4 pb-4">Products</h1>
    <div name="products-container" class="items-center grid grid-cols-2 gap-2 pl-2 pr-2 mb-4 place-items-center overflow-y-scroll">
      <div v-if="products && products.length !== 0" v-for="item in products" :key="item.product.id" @click="router.push(`/products/${item.product.id}`)" name="product" class="w-44 bg-[#363A47] active:scale-95 duration-200 shadow-md rounded-lg overflow-hidden">
        <div class="relative">
          <img :src="item.product.images[0]"
            :alt="item.product.name" class="w-full h-36 object-cover" />
          <!-- <span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            50% OFF
          </span> -->
        </div>
        <div class="p-4">
          <h2 class="text-md font-semibold text-gray-300 mb-1 truncate">{{item.product.name}}</h2>
          <div class="flex justify-between items-center mb-1">
            <span class="text-md font-bold text-white">{{ formatPrice(item.product.price) }} ETB</span>
            <!-- <span class="text-sm text-gray-500 line-through">
              500 ETB
            </span> -->
          </div>
          <p class="text-xs text-gray-400">Condition: {{ item.product.condition.charAt(0).toUpperCase() + item.product.condition.slice(1) }}</p>
        </div>
      </div>
      <div v-else-if="products && products.length == 0">
        <p class="text-white">No products found</p>
      </div>
      <div v-else v-for="_ in 5" name="product" class="w-44 bg-[#363A47] active:scale-95 duration-200 shadow-md rounded-lg overflow-hidden">
        <div class="relative">
          <div class="h-36 w-full bg-gray-600"></div>
        </div>
        <div class="p-4">
          <h2 class="text-md font-semibold text-gray-300 mb-1 truncate">
            <div class="h-5 w-28 rounded bg-gray-600"></div>
          </h2>
          <div class="flex justify-between items-center mb-1">
            <span class="text-md font-bold text-white">
              <div class="h-5 w-28 rounded bg-gray-600"></div>
            </span>
            <!-- <span class="text-sm text-gray-500 line-through">
              500 ETB
            </span> -->
          </div>
          <p class="text-xs text-gray-400 bg-gray-600 h-5 w-14 rounded"></p>
        </div>
      </div>
    </div>
  </div>
</template>

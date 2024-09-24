
<script setup>
import { ref, onMounted } from 'vue'
import { X, UserRound, ChevronLeft, ChevronRight, MapPin, User } from 'lucide-vue-next'
import { useRouter } from "vue-router"
import reverseGeocode from "../../reverseGeocode"
import formatPrice from "../../utils"


const router = useRouter()
const product = ref(null)
const seller = ref(null)
const location = ref(null)


const currentImage = ref(0);


const loadProduct = async () => {
  const productId = router.currentRoute.value.params.id
  const productUrl = `${import.meta.env.VITE_BACKEND_URL}/products/${productId}`;
  console.log(productUrl)
  try {
    const response = await fetch(productUrl);
    const data = await response.json();
    console.log("data: ", data)
    product.value = data.product;
    seller.value = data.user
    const { country, county, state, village } = await reverseGeocode(data.user.location.x, data.user.location.y)
    location.value = {"country": country, "county": county, "state": state, "village": village}
  } catch (error) {
      console.error('Error fetching product:', error);
  }

}

const changeCurrentImage = (navType) => {
  if (navType === "prev") {
    if (currentImage.value > 0) {
      currentImage.value--;
    }
  } else {
    if (currentImage.value < product.value.images.length - 1) {
      currentImage.value++;
    }
  }
};


onMounted(() => {
  loadProduct()
  if (window.Telegram?.WebApp) {
    console.log('Telegram WebApp initialized');
    const webApp = window.Telegram.WebApp;

    // Expand the Web App to full-screen mode
    webApp.expand();

    webApp.BackButton.show();
    webApp.BackButton.onClick(() => {
      router.back()
    })


    webApp.MainButton.show();
    webApp.MainButton.text = "Contact Seller";
    // webApp.MainButton.color = "#fc6203"
    webApp.MainButton.onClick(() => {
      window.location.href=`tel:+${seller.value.contact}`
    });
  } else {
    console.error('Telegram WebApp not initialized');
  }
});

</script>

<template>
  <div v-if="product" name="image-container" class="h-64 overflow-hidden">
    <img class="object-contain h-full w-full" :alt="product.name" :src="product.images[currentImage]"></img>
    <div v-if="product.images.length > 1" name="image-buttons" class="absolute top-28 w-full flex justify-between pl-4 pr-4">
      <button @click="changeCurrentImage('prev')" class="bg-[#363A47] rounded-[50px] p-2">
        <ChevronLeft class="text-blue-500" />
      </button>
      <button @click="changeCurrentImage('next')" class="bg-[#363A47] rounded-[50px] p-2">
        <ChevronRight class="text-blue-500" />
      </button>
    </div>
    <div v-if="product.images.length > 1" name="position-indicator" class="absolute flex gap-1 bg-[#363A47] top-56 left-1/2 p-2 rounded-xl -translate-x-1/2">
      <div v-for="(image, index) in product.images" :key="image" :class="{'bg-blue-500': index == currentImage,'bg-gray-500': index != currentImage }" class="h-2 w-2 rounded-full"></div>
    </div>
  </div>

  <div v-if="product">
    <h1 class="m-4 text-blue-500 font-bold">Product Information</h1>
    <div name="section">
      <div class="border-[1px] p-4 flex justify-between text-white border-black">
        <span>Product Title</span>
        <span>{{ product.name }}</span>
      </div>
      <div class="p-4 flex justify-between text-white border-black">
        <span>Price</span>
        <span>{{ formatPrice(product.price) }} ETB</span>
      </div>
      <div class="border-[1px] p-4 flex justify-between text-white border-black">
        <span>Condition</span>
        <span>{{ product.condition.charAt(0).toUpperCase() + product.condition.slice(1) }}</span>
      </div>
    </div>
  </div>
  <div v-if="product">
    <h1 class="m-4 text-blue-500 font-bold">Additional Information</h1>
    <div name="section">
      <div name="location-container" class="border-[1px] p-4 flex justify-between text-white border-black">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-fuchsia-600">
            <MapPin color="white" />
          </div>
          <span>{{ location ? `${location.state}, ${location.country}` : "Loading..." }}</span>
        </div>
      </div>
      <div class="border-b-[1px] p-4 flex justify-between text-white border-black">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-blue-500">
            <UserRound color="white" />
          </div>
          <span><a :href="`tel:${seller.contact}`" class="text-blue-500" target="_blank">+{{ seller.contact }}</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

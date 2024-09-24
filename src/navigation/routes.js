// Suggested code may be subject to a license. Learn more: ~LicenseLog:2854776839.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2823317780.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2500948270.
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import CheckoutView from "../views/CheckoutView.vue"
import ProductDetailView from '../views/ProductDetailView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products/:id',
    name: 'product',
    component: () => import('../views/ProductDetailView.vue')
  },
  // {
  //   path: '/products/:id',
  //   name: 'product',
  //   component: CheckoutView
  // }
]

const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory("/"),
  routes
})

export default router

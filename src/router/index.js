import { createRouter, createWebHistory } from 'vue-router'

// Public Views
import HomeView from '../Views/Public/HomeView.vue'
import AboutView from '../Views/Public/AboutView.vue'
import BooksListView from '../Views/Public/BooksListView.vue'
import BooksDetailsView from '../Views/Public/BooksDetailsView.vue'
import AuthorsListView from '../Views/Public/AuthorsListView.vue'
import AuthorDetailsView from '../Views/Public/AuthorDetailsView.vue'

// Admin Views
import DashboardView from '@/Views/Admin/DashboardView.vue'
import BooksTableView from '@/Views/Admin/BooksTable.vue'
import BookFormView from '@/Views/Admin/BookFormView.vue'
import AuthorsFormView from '@/Views/Admin/AuthorsFormView.vue'
import AuthorsTableView from '@/Views/Admin/AuthorsTableView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     // Public Routes
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About Us' }
  },
  {
    path: '/books',
    name: 'books',
    component: BooksListView,
    meta: { title: 'Books' }
  },
  {
    path: '/books/:id',
    name: 'book-details',
    component: BooksDetailsView,
    meta: { title: 'Book Details' }
  },
  {
    path: '/authors',
    name: 'authors',
    component: AuthorsListView,
    meta: { title: 'Authors' }
  },
  {
    path: '/authors/:id',
    name: 'author-details',
    component: AuthorDetailsView,
    meta: { title: 'Author Details' }
  },

  // Admin Routes
  {
    path: '/admin',
    name: 'admin',
    component: DashboardView,
    meta: { title: 'Admin Dashboard', requiresAuth: true }
  },
  {
    path: '/admin/books',
    name: 'admin-books',
    component: BooksTableView,
    meta: { title: 'Manage Books', requiresAuth: true }
  },
  {
    path: '/admin/books/new',
    name: 'admin-books-create',
    component: BookFormView,
    meta: { title: 'Create Book', requiresAuth: true }
  },
  {
    path: '/admin/books/:id/edit',
    name: 'admin-books-edit',
    component: BookFormView,
    meta: { title: 'Edit Book', requiresAuth: true }
  },
  {
    path: '/admin/authors',
    name: 'admin-authors',
    component: AuthorsTableView,
    meta: { title: 'Manage Authors', requiresAuth: true }
  },
  {
    path: '/admin/authors/new',
    name: 'admin-authors-create',
    component: AuthorsFormView,
    meta: { title: 'Create Author', requiresAuth: true }
  },
  {
    path: '/admin/authors/:id/edit',
    name: 'admin-authors-edit',
    component: AuthorsFormView,
    meta: { title: 'Edit Author', requiresAuth: true }
  },

  
  ],
})

export default router

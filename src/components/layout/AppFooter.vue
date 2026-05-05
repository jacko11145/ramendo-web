<template>
  <footer class="border-t border-site-gray bg-ink-light mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <p class="font-bebas text-2xl tracking-widest text-cream">拉麵道</p>
        <p class="text-xs text-site-gray-lighter mt-1">探索台灣最棒的拉麵體驗</p>
      </div>
      <div class="flex gap-6 text-sm text-site-gray-lighter">
        <RouterLink to="/ramen-shops" class="hover:text-cream transition-colors">店家探索</RouterLink>
        <RouterLink to="/rankings" class="hover:text-cream transition-colors">排行榜</RouterLink>
        <RouterLink to="/user/submit-shop" class="hover:text-cream transition-colors">提案店家</RouterLink>
      </div>
      <p class="text-xs text-site-gray-lighter">© {{ new Date().getFullYear() }} 拉麵道</p>
    </div>
  </footer>
</template>

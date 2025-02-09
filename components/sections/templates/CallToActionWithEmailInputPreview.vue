<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white flex items-center justify-center px-2 py-8">
    <div class="max-w-[95%] w-full">
      <div class="bg-gradient-to-b from-[#3374FF] to-[#1F4699] rounded-xl p-8 relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="text-lg font-bold text-white mb-6 text-center">
            {{ section.title }}
          </h2>
          <div class="flex items-center justify-center">
            <div class="relative w-[320px]">
              <a-input 
                :placeholder="section.bottomContent?.inputPlaceholder || 'Enter your email address'"
                class="w-full bg-white border-none text-xs h-[40px] rounded-[26px] placeholder-gray-400"
              />
              <button class="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-[4px] text-xs rounded-[22px] hover:bg-gray-800 transition-colors">
                {{ section.buttonText || 'Get Started' }}
              </button>
            </div>
          </div>
          <p class="text-white text-xs mt-4 text-center">
            {{ section.bottomContent?.smallText || 'We respect your privacy and keep your data secure' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
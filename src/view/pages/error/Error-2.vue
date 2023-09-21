<template>
  <div class="d-flex flex-column flex-root w-100">
    <div
      class="d-flex flex-row-fluid bgi-size-cover bgi-position-center"
      :style="{
        backgroundImage: `url(${backgroundImage})`
      }"
    >
      <!-- begin:: Content -->
      <div
        class="d-flex flex-row-fluid flex-column justify-content-end align-items-center text-center text-white pb-40"
      >
        <h1 class="display-1 font-weight-bold">
          OOPS!
        </h1>
        <span class="display-4 font-weight-boldest mb-8">
          Something went wrong here
        </span>
      </div>
      <!-- end:: Content -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Error-2",
  computed: {
    backgroundImage() {
      return process.env.BASE_URL + "media/error/bg2.jpg";
    }
  }
};
</script>

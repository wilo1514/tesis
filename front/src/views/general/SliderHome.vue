<template>
    <div >ss
        <b-carousel id="my-carousel" :interval="5000" controls>
            <b-carousel-slide img-src="https://d107mjio2rjf74.cloudfront.net/sites/res/home/common/header.png"></b-carousel-slide>
            <b-carousel-slide img-src="https://d107mjio2rjf74.cloudfront.net/sites/res/home/common/header.png"></b-carousel-slide>
            <b-carousel-slide img-src="https://d107mjio2rjf74.cloudfront.net/sites/res/home/common/header.png"></b-carousel-slide>
        </b-carousel>
    </div>
</template>
  
<script>
import { BCarousel, BCarouselSlide } from 'bootstrap-vue';

export default {
    components: {
        BCarousel,
        BCarouselSlide,
    },
};
</script>
  
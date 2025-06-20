const { createApp } = Vue;

createApp({
    data() {
        return {
            dog_img_link: '',
            visible: false,
            button_pos: { top: 200, left: window.innerWidth - 200 / 2 -75}
        };
    },
    methods: {
        getDog() {
            fetch('https://dog.ceo/dog-api/documentation/random').then(response => {
        }
    }
})
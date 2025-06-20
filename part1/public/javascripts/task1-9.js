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
            fetch('https://dog.ceo/dog-api/documentation/random')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'sucess') {
                        this.dog_img_link = data.message;
                    }
                })
                .catch(err => console.error(err));
        },

        showDogPics() {
            this.visible = true;
        },

        moveButton() {
            var top = Math.random() * (windows.innerHeight - 100);
            var left = Math.random() * (window.innerWidth - 200);
            this.button_pos = {top: top, left: left};
        }
    },
    mounted() {
        this.getDog();
    }
}).mount
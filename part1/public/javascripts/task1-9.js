<script src="https://unpkg.com/vue@3"></script>
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
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                try {
                    const data = JSON.parse(xhr.responseText);

                    if (data.status === 'success') {
                        this.dog_img_link = data.message;
                    }
                }  catch (e) {
                    console.error("Error parsing JSON:", e);
                }
            } else {
                console.error("Request failed with status:", xhr.status);
            }
        },

        showDogPics() {
            this.visible = true;
        },

        moveButton() {
            var top = Math.random() * (window.innerHeight - 100);
            var left = Math.random() * (window.innerWidth - 200);
            this.button_pos = {top: top, left: left};
        }
    },
    mounted() {
        this.getDog();
    }
}).mounted('#app');